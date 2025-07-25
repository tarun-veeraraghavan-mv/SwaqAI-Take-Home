import axios from "axios";

export async function generateTranscriptAndLLMResponse(videoId: string) {
  const res = await axios.post(
    "http://localhost:8000/api/generate-transcript-and-llm-response/",
    { video_id: videoId }
  );

  return res.data;
}

export async function getVideoDetails(videoId: string) {
  const res = await axios.get(
    `http://localhost:8000/api/get-video-details/${videoId}/`
  );

  return res.data;
}

export async function getTranscriptByVideoId(videoId: string) {
  const res = await axios.get(
    `http://localhost:8000/api/get-simple-transcript-fetcher/${videoId}/`
  );

  return res.data.full_text;
}

export async function getLLMResponseByVideoId(videoId: string) {
  const res = await axios.get(
    `http://localhost:8000/api/get-simple-episode-fetcher/${videoId}/`
  );

  return res.data.response;
}
