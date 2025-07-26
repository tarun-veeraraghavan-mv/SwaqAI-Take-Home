from django.urls import path
from .views.youtube_loader import fetch_youtube_videos_from_channel_url, get_task_status
from .views.channels import get_channels_for_user, delete_channel_for_user, create_channel_for_user
from .views.episodes import get_video_details, get_episode_by_id, get_video_transcript
from .views.ai import create_analysis


urlpatterns = [
    # channels related API routes
    path("channels/", create_channel_for_user),
    path("channels/list/", get_channels_for_user),
    path("channels/<channel_id>/", delete_channel_for_user),
    # video details
    path("channels/videos/list/", fetch_youtube_videos_from_channel_url, name="get_videos_for_channel"),
    path("video/<video_id>/details/", get_video_details),
    path("video/<video_id>/transcript/", get_video_transcript),
    path("get-episode/<episode_id>/", get_episode_by_id),
    # ai related API routes - prod
    path("analysis/video/<video_id>/create/", create_analysis),
    # utils
    path("get-task-status/<task_id>/", get_task_status),
]
