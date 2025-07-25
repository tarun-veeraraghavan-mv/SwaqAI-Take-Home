from django.urls import path
from .views.youtube_loader import fetch_youtube_videos_from_channel_url, fetch_video_transcript, extract_questions, get_task_status

urlpatterns = [
    path("fetch-youtube-videos-from-channel-url/", fetch_youtube_videos_from_channel_url),
    path("fetch-video-transcript-by-id/", fetch_video_transcript),
    path("generate-response/", extract_questions),
    path("get-task-status/<task_id>/", get_task_status)
]
