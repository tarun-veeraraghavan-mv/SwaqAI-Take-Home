import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChannelCardProps } from "@/types/channels";
import {
  deleteChannelForUser,
  fetchVideosForChannel,
} from "@/services/channels";

export default function ChannelCard({
  channel,
  onDeleteChannel,
}: ChannelCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(url: string) {
    const data = await fetchVideosForChannel(url);

    router.push(`/channel/${data.task_id}`);
  }

  async function handleDelete(channelId: number) {
    try {
      setDeleting(true);

      await deleteChannelForUser(channelId);

      onDeleteChannel(channelId);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
    }
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
        <button onClick={() => handleDelete(channel.id)} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete channel"}
        </button>
      </div>
    </li>
  );
}
