import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from celery.result import AsyncResult
from celery import chain
from ..tasks import fetch_channel_videos_task, fetch_transcript_task, generate_response_task
from dotenv import load_dotenv
load_dotenv()

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@api_view(["POST"])
def fetch_youtube_videos_from_channel_url(request):
    channel_url = request.data.get("channel_url")

    if not channel_url:
        return Response({"error": "Missing channel_url"}, status=400)

    # Fire off the task
    task = fetch_channel_videos_task.delay(channel_url)

    return Response({"task_id": task.id})
    
@api_view(["POST"])
def fetch_video_transcript(request):
    video_id = request.data.get("video_id")
    if not video_id:
        return Response({"error": "Missing video_id"}, status=400)

    task_chain = chain(
        fetch_transcript_task.s(video_id),
        generate_response_task.s()  
    ).apply_async()

    return Response({"task_id": task_chain.id}, status=202)
    
@api_view(["POST"])
def extract_questions(request):
    transcript = request.data.get("transcript")

    if not transcript:
        return Response({"error": "Missing transcript"}, status=400)

    try:
        output = generate_response(transcript=transcript)
        print(output)
        return Response('ok')

    except Exception as e:
        return Response({"error": str(e)}, status=500)

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

@api_view(["GET"])
def get_video_details(request, video_id):
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id={video_id}&key={YOUTUBE_API_KEY}"
    res = requests.get(url).json()
    items = res.get("items", [])
    if not items:
        raise ValueError("Invalid video ID or video not found.")

    data = items[0]
    return Response({
        "title": data["snippet"]["title"],
        "description": data["snippet"]["description"],
        "views": data["statistics"].get("viewCount"),
        "likes": data["statistics"].get("likeCount"),
        "duration": data["contentDetails"].get("duration"),
        "published": data["snippet"]["publishedAt"],
    })

