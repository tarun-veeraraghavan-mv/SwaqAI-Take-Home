import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from celery.result import AsyncResult
from celery import chain
from ..tasks import fetch_channel_videos_task, fetch_transcript_task, generate_response_task
from ..models import Channel
from ..serializers import ChannelSerializer
from django.views.decorators.cache import cache_page
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

# wiehxguw
# 71d1jkqtyzyl

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

@api_view(["GET"])
def get_channels_for_user(request):
    channels = Channel.objects.all()

    serialized = ChannelSerializer(channels, many=True)

    return Response({"channels": serialized.data})

@api_view(["POST"])
def get_channel_details_from_handle(request):
    handle = request.data.get("handle")
    if not handle:
        return Response({"error": "Missing 'handle' query param"}, status=400)

    # Step 1: Get channel ID using search
    search_url = (
        f"https://www.googleapis.com/youtube/v3/search?"
        f"part=snippet&type=channel&q={handle}&key={YOUTUBE_API_KEY}"
    )
    search_res = requests.get(search_url).json()
    items = search_res.get("items", [])
    if not items:
        return Response({"error": "Channel not found"}, status=404)

    channel_id = items[0]["snippet"]["channelId"]

    # Step 2: Fetch full channel details using the real channel ID
    channel_url = (
        f"https://www.googleapis.com/youtube/v3/channels?"
        f"part=snippet,statistics,contentDetails&id={channel_id}&key={YOUTUBE_API_KEY}"
    )
    channel_res = requests.get(channel_url).json()
    channel_items = channel_res.get("items", [])
    if not channel_items:
        return Response({"error": "Failed to fetch channel details"}, status=500)

    data = channel_items[0]

    channel = Channel.objects.create(
        channel_id=channel_id, 
        title=data["snippet"]["title"],
        description= data["snippet"]["description"],
        thumbnail=data["snippet"]["thumbnails"]["high"]["url"],
        published_at=data["snippet"]["publishedAt"],
        subscriber_count=int(data["statistics"].get("subscriberCount")),
        video_count=int(data["statistics"].get("videoCount")),
        view_count=int(data["statistics"].get("viewCount")),
        channel_url=f"https://www.youtube.com/channel/{channel_id}"
        )
    
    serialized = ChannelSerializer(channel)

    return Response({"channel": serialized.data})