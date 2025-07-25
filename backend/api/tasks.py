import time
import requests
from celery import shared_task

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@shared_task
def notify_customers(message):
    print("Something 10k emails")
    time.sleep(20)
    print("Emails were sent")
    return f"Emails sent with message: {message}"

@shared_task
def fetch_channel_videos_task(channel_url):
    try:
        # STEP 1: Get channel ID
        search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q={channel_url}&key={YOUTUBE_API_KEY}"
        channel_res = requests.get(search_url).json()
        channel_id = channel_res["items"][0]["snippet"]["channelId"]

        # STEP 2: Get uploads playlist ID
        channel_details_url = f"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={channel_id}&key={YOUTUBE_API_KEY}"
        details_res = requests.get(channel_details_url).json()
        uploads_playlist_id = details_res["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        # STEP 3: Fetch videos from playlist
        videos_url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={uploads_playlist_id}&maxResults=25&key={YOUTUBE_API_KEY}"
        videos_res = requests.get(videos_url).json()

        videos = [
            {
                "title": item["snippet"]["title"],
                "video_id": item["snippet"]["resourceId"]["videoId"],
                "video_url": f"https://www.youtube.com/watch?v={item['snippet']['resourceId']['videoId']}"
            }
            for item in videos_res["items"]
        ]

        # Optional: Save to DB if you have models
        # for v in videos:
        #     Episode.objects.create(...)

        return {
            "channel_id": channel_id,
            "videos": videos
        }

    except Exception as e:
        return {"error": str(e)}