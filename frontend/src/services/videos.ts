import { BACKEND_URL } from "@/constants/urls";
import axios from "axios";

export async function getVideoDetails(videoId: string) {
  const res = await axios.get(`${BACKEND_URL}/api/video/${videoId}/details/`);

  return res.data;
}

export async function getTranscriptByVideoId(videoId: string) {
  const res = await axios.get(
    `${BACKEND_URL}/api/video/${videoId}/transcript/`
  );

  return res.data.full_text;
}

export async function fetchVideosForChannel(channelUrl: string) {
  const res = await axios.post(`${BACKEND_URL}/api/channels/videos/list/`, {
    channel_url: channelUrl,
  });

  return res.data;
}
