from django.urls import path
from .views.youtube_loader import fetch_youtube_videos_from_channel_url, fetch_video_transcript, extract_questions, get_task_status
from .views.channels import get_channels_for_user, delete_channel_for_user, create_channel_for_user
from .views.episodes import get_video_details, get_llm_response_of_episode, get_episode_by_id, generate_transcript_and_llm_response, get_simple_transcript_fetcher, get_simple_llm_fetcher


urlpatterns = [
    path("fetch-youtube-videos-from-channel-url/", fetch_youtube_videos_from_channel_url),
    path("fetch-video-transcript-by-id/", fetch_video_transcript),
    path("generate-response/", extract_questions),
    path("get-task-status/<task_id>/", get_task_status),
    path("get-video-details/<video_id>/", get_video_details),
    path("get-channel-details/", create_channel_for_user),
    path("get-channels-for-user/", get_channels_for_user),
    path("delete-channel-for-user/<channel_id>/", delete_channel_for_user),
    path("generate-transcript-and-llm-response/", generate_transcript_and_llm_response),
    path("get-episode/<episode_id>/", get_episode_by_id),
    path("get-llm-response-of-video/<episode_id>/", get_llm_response_of_episode),
    path("get-simple-transcript-fetcher/<video_id>/", get_simple_transcript_fetcher),
    path("get-simple-episode-fetcher/<video_id>/", get_simple_llm_fetcher),
]
