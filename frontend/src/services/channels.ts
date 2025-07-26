import axios from "axios";

export async function addChannelForUser(channelName: string) {
  const res = await axios.post("http://localhost:8000/api/channels/", {
    handle: channelName,
  });

  return res.data;
}

export async function fetchUserChannels() {
  const res = await axios.get("http://localhost:8000/api/channels/list/");

  return res.data;
}

export async function deleteChannelForUser(channelId: number) {
  await axios.delete(`http://localhost:8000/api/channels/${channelId}/`);
}
