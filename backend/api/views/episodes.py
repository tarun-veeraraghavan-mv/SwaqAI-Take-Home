import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache
from ..models import Episode
from ..tasks import get_video_transcript_poll
from ..llm_workflows.test import run_langgraph_pipeline

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@api_view(["GET"])
def hello(request):
    return Response("Hello world")

@api_view(["GET"])
def get_video_details(request, video_id):
    cache_key = f"video-details:{video_id}"
    cache_data = cache.get(key=cache_key)

    if cache_data:
        return Response({"video": cache_data, "cached": True})

    try:  
      url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id={video_id}&key={YOUTUBE_API_KEY}"
      res = requests.get(url).json()
      items = res.get("items", [])
      if not items:
          raise ValueError("Invalid video ID or video not found.")

      data = items[0]
      video = {
          "title": data["snippet"]["title"],
          "description": data["snippet"]["description"],
          "views": int(data["statistics"].get("viewCount")),
          "likes": int(data["statistics"].get("likeCount")) ,
          "duration": data["contentDetails"].get("duration"),
          "published": data["snippet"]["publishedAt"],
          "thumbnail": data["snippet"]["thumbnails"]["high"]["url"],
      }
      
      cache.set(cache_key, video, timeout=1200)

      return Response({"video": video, "cached": False})
    except Exception:
        return Response({"error": "Error in fetching video details"}, status=400)

@api_view(["GET"])
def get_episode_by_id(request, episode_id):
    episode = Episode.objects.get(id=episode_id)

    return Response({"full_text": episode.transcript})

@api_view(["GET"])
def get_video_transcript(request, video_id):
    cache_key = f"video-transcript:{video_id}"
    cache_data = cache.get(key=cache_key)

    if cache_data:
        return Response(cache_data)

    response = requests.get(
        f"https://api.scrapingdog.com/youtube/transcripts/?api_key=68485af4f6497c6ac1c4ca16&v={video_id}"
    )

    try:
        data = response.json()

        if not isinstance(data, dict):
            return "API response is not a dict"

        if "transcripts" not in data:
            return f"❌ 'transcripts' key not found. Got keys: {list(data.keys())}"

        transcript = data["transcripts"]

        full_text = " ".join(chunk.get("text", "") for chunk in transcript)

        result = {"full_text": full_text}

        cache.set(cache_key, result, timeout=3600)

        return Response(result) 
    except Exception as e:
        print("❌ Failed to parse JSON:", str(e))
        return "Failed to parse JSON"
    
@api_view(["GET"])
def get_video_transcript_polling(request, video_id):
    print(video_id)

    try:
        task = get_video_transcript_poll.delay(video_id)

        return Response({"task_id": task.id}) 
    except Exception:
        return {"error": "Error fetching transcript"}