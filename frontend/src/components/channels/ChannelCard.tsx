import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChannelCardProps } from "@/types/channels";

export default function ChannelCard({
  channel,
  onDeleteChannel,
}: ChannelCardProps) {
  const router = useRouter();

  async function handleSubmit(url: string) {
    const res = await axios.post(
      "http://localhost:8000/api/fetch-youtube-videos-from-channel-url/",
      {
        channel_url: url,
      }
    );

    console.log(res.data);
    router.push(`/channel/${res.data.task_id}`);
  }

  return (
    <li className="bg-gray-200 p-2">
      <p>{channel.title}</p>
      <img src={channel.thumbnail} alt="Image of yt thuimbnail" />
      <p>{channel.subscriber_count}</p>
      <p>{channel.published_at}</p>
      <div className="flex justify-between">
        <button onClick={() => handleSubmit(channel.channel_url)}>
          Search this video
        </button>
        <button onClick={() => onDeleteChannel(channel.id)}>
          Delete channel
        </button>
      </div>
    </li>
  );
}
