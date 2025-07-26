from ..models import Channel
from ..serializers import ChannelSerializer
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@api_view(["GET"])
def get_channels_for_user(request):
    cache_key = f"user-channels"
    cached_data = cache.get(key=cache_key)

    if cached_data:
        return Response({"channels": cached_data, "cached": True})
    
    try:
        channels = Channel.objects.all()

        serialized = ChannelSerializer(channels, many=True)

        cache.set(cache_key, serialized.data, timeout=1200)
        print("Set in cache", serialized.data)

        return Response({"channels": serialized.data, "cached": False})

    except Exception as err:
        return Response({"error": "Error fetching channels"}, status=404)

@api_view(["POST"])
def create_channel_for_user(request):
    handle = request.data.get("handle")
    if not handle:
        return Response({"error": "Missing 'handle' query param"}, status=400)
    
    try:
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
        
        cache.delete("user-channels")
    
        serialized = ChannelSerializer(channel)

        return Response({"channel": serialized.data}, status=200)
    except Exception as err:
        return Response({"error": "Error fetching channels"}, status=404)

@api_view(["DELETE"])
def delete_channel_for_user(request, channel_id):
    if not channel_id:
        return Response({"error": "Channel ID is required"}, status=400)

    try:
        channel = Channel.objects.get(id=channel_id)
        channel.delete()

        cache.delete("user-channels")

        return Response({"message": "Channel deleted successfully"}, status=200)
    except Channel.DoesNotExist:
        return Response({"error": "Channel not found"}, status=404)
