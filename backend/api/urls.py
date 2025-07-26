from django.urls import path
from .views.youtube_loader import fetch_youtube_videos_from_channel_url, extract_questions, get_task_status
from .views.channels import get_channels_for_user, delete_channel_for_user, create_channel_for_user
from .views.episodes import get_video_details, get_llm_response_of_episode, get_episode_by_id, generate_transcript_and_llm_response, get_video_transcript, get_simple_llm_fetcher
from .views.ai import create_analysis


urlpatterns = [
    # channels related API routes
    path("channels/", create_channel_for_user, name="create_channel"),
    path("channels/list/", get_channels_for_user, name="list_channels"),
    path("channels/<channel_id>/", delete_channel_for_user, name="delete_channel"),
    # video details
    path("channels/videos/list/", fetch_youtube_videos_from_channel_url, name="get_videos_for_channel"),
    path("video/<video_id>/details/", get_video_details),
    path("video/<video_id>/transcript/", get_video_transcript),
    # ai related API routes - prod
    path("analysis/video/<video_id>/create/", create_analysis),
    # ai related API routes - test
    path("generate-transcript-and-llm-response/", generate_transcript_and_llm_response),
    path("get-episode/<episode_id>/", get_episode_by_id),
    path("get-llm-response-of-video/<episode_id>/", get_llm_response_of_episode),
    path("get-simple-episode-fetcher/<video_id>/", get_simple_llm_fetcher),
    path("generate-response/", extract_questions),
    # utils
    path("get-task-status/<task_id>/", get_task_status),
]
