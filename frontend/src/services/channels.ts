import axios from "axios";

export async function addChannelForUser(channelName: string) {
  const res = await axios.post(
    "http://localhost:8000/api/get-channel-details/",
    {
      handle: channelName,
    }
  );

  return res.data;
}

export async function fetchVideosForChannel(channelUrl: string) {
  const res = await axios.post(
    "http://localhost:8000/api/fetch-youtube-videos-from-channel-url/",
    {
      channel_url: channelUrl,
    }
  );

  return res.data;
}

export async function deleteChannelForUser(channelId: number) {
  await axios.delete(
    `http://localhost:8000/api/delete-channel-for-user/${channelId}/`
  );
}
