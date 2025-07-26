import requests
from celery import shared_task
import os
from .models import Episode
from django.core.cache import cache
from .llm_workflows.test import llm_chain
from dotenv import load_dotenv
load_dotenv()

def generate_response(transcript: str):
    response = llm_chain.invoke({"transcript": transcript})

    return response.content

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@shared_task
def fetch_channel_videos_task(channel_url):
    cache_key = f"videos_for_channel:{channel_url}"
    cache_data = cache.get(key=cache_key)

    if cache_data:
        return {**cache_data, "cache": True}

    try:
        # STEP 1: Get channel ID
        search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q={channel_url}&key={YOUTUBE_API_KEY}"
        channel_res = requests.get(search_url).json()
        items = channel_res.get("items", [])
        if not items:
            raise ValueError("No channel found for the given URL or name.")

        channel_id = items[0]["snippet"]["channelId"]

        # STEP 2: Get uploads playlist ID
        channel_details_url = f"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={channel_id}&key={YOUTUBE_API_KEY}"
        details_res = requests.get(channel_details_url).json()
        uploads_playlist_id = details_res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        # STEP 3: Get video IDs from uploads playlist
        playlist_items_url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={uploads_playlist_id}&maxResults=25&key={YOUTUBE_API_KEY}"
        playlist_res = requests.get(playlist_items_url).json()
        playlist_items = playlist_res.get("items", [])
        if not playlist_items:
            raise ValueError("No videos found in the uploads playlist.")

        video_ids = [item["snippet"]["resourceId"]["videoId"] for item in playlist_items]
        ids_param = ",".join(video_ids)

        # STEP 4: Get full video details
        videos_url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id={ids_param}&key={YOUTUBE_API_KEY}"
        videos_res = requests.get(videos_url).json()

        videos = [
            {
                "title": item["snippet"]["title"],
                "video_id": item["id"],
                "video_url": f"https://www.youtube.com/watch?v={item['id']}",
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "views": item["statistics"].get("viewCount", "0"),
                "likes": item["statistics"].get("likeCount", "0"),
                "duration": item["contentDetails"]["duration"],
                "published_at": item["snippet"]["publishedAt"]
            }
            for item in videos_res.get("items", [])
        ]

        result = {
            "status": "SUCCESS",
            "channel_id": channel_id,
            "videos": videos
        }

        cache.set(cache_key, result, timeout=1200)

        return result

    except Exception as e:
        return {
            "status": "FAILURE",
            "error": str(e)
        }

            
@shared_task
def fetch_transcript_task(video_id):
    response = requests.get(
        f"https://api.scrapingdog.com/youtube/transcripts/?api_key=68485af4f6497c6ac1c4ca16&v={video_id}"
    )

    try:
        data = response.json()
    except Exception as e:
        print("❌ Failed to parse JSON:", str(e))
        return "Failed to parse JSON"

    print("🔍 TRANSCRIPT RAW:", data)

    if not isinstance(data, dict):
        return "API response is not a dict"

    if "transcripts" not in data:
        return f"❌ 'transcripts' key not found. Got keys: {list(data.keys())}"

    transcript = data["transcripts"]

    full_text = " ".join(chunk.get("text", "") for chunk in transcript)

    episode = Episode.objects.create(transcript=full_text)

    response_generation_task = generate_response_task.delay(transcript=full_text, episode_id=episode.id)

    return {
            "status": "SUCCESS",
            "episode_id": episode.id,
            "response_generation_task_id": response_generation_task.task_id
        }

@shared_task
def generate_response_task(transcript: str, episode_id: int):
    try:
        response = generate_response(transcript=transcript)

        episode = Episode.objects.get(id=episode_id)
        episode.questions = response
        episode.save()

        return {"status": "SUCCESS", "episode_id": episode.id}
    except Exception as e:
        return {"status": "FAILURE", "error": str(e)}