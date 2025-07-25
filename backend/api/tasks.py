import requests
from celery import shared_task
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv()

openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

llm = ChatOpenAI(
    openai_api_key=openrouter_api_key,
    model="deepseek/deepseek-r1-0528-qwen3-8b:free",
    openai_api_base="https://openrouter.ai/api/v1",
)

prompt = ChatPromptTemplate.from_messages([
  ("system", """
You are an expert analyst who given a transcript follows the instructions gievn below

1. Extract the key questions being discussed in the transcript.
2. For each question:
    - Is the answer given in the transcript correct or misleading?
    - Provide a short commentary:
        - ✅ If correct, explain briefly.
        - ❌ If wrong, say why (factually wrong / biased / oversimplified / outdated / misleading).
3. Find the exact span of the transcript text where the answer is discussed.
    - Return the **start and end character index** of the entire evidence you used to justify the commentary (not timestamps).
    - Make sure they are perfect **based on the original transcript string** you received. 
    - Dont add any text or descriptions
        
Respond in JSON format like:
[
  {{
    "question": "...",
    "answer_agreement": true/false,
    "commentary": "...",
    "start_index": 453,
    "end_index": 892
  }},
  ...
]
"""),
("human", "{transcript}")
])

llm_chain = prompt | llm
def generate_response(transcript: str):
    response = llm_chain.invoke({"transcript": transcript})

    return response.content

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@shared_task
def fetch_channel_videos_task(channel_url):
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
        details_items = details_res.get("items", [])
        if not details_items:
            raise ValueError("No content details found for the channel.")

        uploads_playlist_id = details_items[0]["contentDetails"]["relatedPlaylists"]["uploads"]

        # STEP 3: Fetch videos from playlist
        videos_url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={uploads_playlist_id}&maxResults=25&key={YOUTUBE_API_KEY}"
        videos_res = requests.get(videos_url).json()
        videos_items = videos_res.get("items", [])
        if not videos_items:
            raise ValueError("No videos found in the uploads playlist.")

        videos = [
            {
                "title": item["snippet"]["title"],
                "video_id": item["snippet"]["resourceId"]["videoId"],
                "video_url": f"https://www.youtube.com/watch?v={item['snippet']['resourceId']['videoId']}"
            }
            for item in videos_items
        ]

        return {
            "status": "SUCCESS",
            "channel_id": channel_id,
            "videos": videos
        }

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

    return full_text

@shared_task
def generate_response_task(transcript: str):
    return generate_response(transcript=transcript)