import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..llm_workflows.test import llm_chain

@api_view(["POST"])
def create_analysis(request, video_id):
    response = requests.get(
        f"https://api.scrapingdog.com/youtube/transcripts/?api_key=68485af4f6497c6ac1c4ca16&v={video_id}"
    )

    try:
        data = response.json()

        if not isinstance(data, dict):
            return "API response is not a dict"

        if "transcripts" not in data:
            return f"❌ 'transcripts' key not found. Got keys: {list(data.keys())}"

        transcript = data["transcripts"]

        full_text = " ".join(chunk.get("text", "") for chunk in transcript)

        response = llm_chain.invoke({"transcript", full_text})

        return Response(response.content) 
    except Exception as e:
        print("❌ Failed to parse JSON:", str(e))
        return "Failed to parse JSON"
    