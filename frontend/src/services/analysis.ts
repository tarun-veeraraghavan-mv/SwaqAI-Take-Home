import { BACKEND_URL } from "@/constants/urls";
import axios from "axios";

export async function createAnalysisForVideo(videoId: string) {
  const res = await axios.post(
    `${BACKEND_URL}/api/analysis/video/${videoId}/create/`
  );

  console.log(res.data);
}

export async function getTranscriptForVideoPolling(videoId: string) {
  const res = await axios.get(
    `${BACKEND_URL}/api/video/${videoId}/transcript/poll/`
  );

  return res.data;
}
