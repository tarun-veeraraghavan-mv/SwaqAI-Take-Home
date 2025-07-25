from django.urls import path
from .views.youtube_loader import fetch_youtube_videos_from_channel_url, fetch_video_transcript, extract_questions, get_task_status, get_video_details
from .views.chanells import get_channels_for_user, delete_channel_for_user, create_channel_for_user

urlpatterns = [
    path("fetch-youtube-videos-from-channel-url/", fetch_youtube_videos_from_channel_url),
    path("fetch-video-transcript-by-id/", fetch_video_transcript),
    path("generate-response/", extract_questions),
    path("get-task-status/<task_id>/", get_task_status),
    path("get-video-details/<video_id>/", get_video_details),
    path("get-channel-details/", create_channel_for_user),
    path("get-channels-for-user/", get_channels_for_user),
    path("delete-channel-for-user/<channel_id>/", delete_channel_for_user)
]
