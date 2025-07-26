from rest_framework.decorators import api_view
from rest_framework.response import Response
from celery.result import AsyncResult
from celery import chain
from ..tasks import fetch_channel_videos_task
from dotenv import load_dotenv
load_dotenv()

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@api_view(["POST"])
def fetch_youtube_videos_from_channel_url(request):
    channel_url = request.data.get("channel_url")

    if not channel_url:
        return Response({"error": "Missing channel_url"}, status=400)

    try:
        task = fetch_channel_videos_task.delay(channel_url)

        return Response({"task_id": task.id})
    except Exception as err:
        return Response({"error": err})

@api_view(["GET"])
def get_task_status(request, task_id):
    result = AsyncResult(task_id)

    response = {
        "task_id": task_id,
        "status": result.status,
    }

    if result.status == "SUCCESS":
        response["result"] = result.result

    return Response(response)

