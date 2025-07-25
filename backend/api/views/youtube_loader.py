import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import VideoUnavailable, TranscriptsDisabled, NoTranscriptFound
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from celery.result import AsyncResult
from celery import chain
from ..tasks import notify_customers, fetch_channel_videos_task

llm = ChatOpenAI(
    openai_api_key="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",
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

chain = prompt | llm

def generate_response(transcript: str):
    response = chain.invoke({"transcript": transcript})
    return response.content

YOUTUBE_API_KEY = "AIzaSyBiKuzKL7z9Be9ukgiGo0L_A5IGJf9RWr4"

@api_view(["POST"])
def fetch_youtube_videos_from_channel_url(request):
    channel_url = request.data.get("channel_url")

    if not channel_url:
        return Response({"error": "Missing channel_url"}, status=400)

    # Fire off the task
    task = fetch_channel_videos_task.delay(channel_url)

    return Response({"task_id": task.id})
    
@api_view(["POST"])
def fetch_video_transcript(request):
    video_id = request.data.get("video_id")

    if not video_id:
        return Response({"error": "Missing video_id"}, status=400)

    try:
        # Create instance and fetch transcript
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id)

        # Join all text snippets into one continuous string
        full_text = " ".join([entry.text for entry in transcript])

        return Response({
            "video_id": video_id,
            "full_text": full_text
        }, status=200)

    except VideoUnavailable:
        return Response({"error": "Video unavailable"}, status=404)
    except TranscriptsDisabled:
        return Response({"error": "Transcript disabled on this video"}, status=403)
    except NoTranscriptFound:
        return Response({"error": "No transcript found for this video"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(["POST"])
def extract_questions(request):
    transcript = request.data.get("transcript")
    video_id = request.data.get("video_id")

    if not transcript or not video_id:
        return Response({"error": "Missing transcript or video_id"}, status=400)

    try:
        output = generate_response(transcript=transcript)
        print(output)
        return Response('ok')

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(["GET"])
def say_hello(request):
    task = notify_customers.delay("Hello")
    return Response({"task_id": task.id})


@api_view(["GET"])
def get_task_status(request, task_id):
    result = AsyncResult(task_id)

    response = {
        "task_id": task_id,
        "status": result.status,
    }

    if result.status == "SUCCESS":
        response["result"] = result.result

    return Response(response)