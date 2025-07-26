import { BACKEND_URL } from "@/constants/urls";
import axios from "axios";

export async function addChannelForUser(channelName: string) {
  const res = await axios.post(`${BACKEND_URL}/api/channels/`, {
    handle: channelName,
  });

  return res.data;
}

export async function fetchUserChannels() {
  const res = await axios.get(`${BACKEND_URL}/api/channels/list/`);

  return res.data;
}

export async function deleteChannelForUser(channelId: number) {
  await axios.delete(`${BACKEND_URL}/api/channels/${channelId}/`);
}
