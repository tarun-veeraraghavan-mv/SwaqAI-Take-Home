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

    router.push(`/episodes/${data.task_id}`);
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
    <li className="bg-gray-100 p-3 rounded-xl">
      <img
        src={channel.thumbnail}
        alt="Image of yt thuimbnail"
        className="rounded-full mb-3"
      />
      <p className="text-center font-bold">{channel.title}</p>
      <p>{channel.subscriber_count} subscribers</p>
      <p>{channel.video_count} videos post</p>
      <p>{channel.view_count} total views</p>
      <div className="flex justify-between">
        <button
          onClick={() => handleSubmit(channel.channel_url)}
          className="bg-blue-400 font-bold text-white p-1 rounded-lg disabled:cursor-not-allowed cursor-pointer"
        >
          Search videos...
        </button>
        <button
          onClick={() => handleDelete(channel.id)}
          disabled={deleting}
          className="bg-red-400 font-bold text-white p-1 rounded-lg disabled:cursor-not-allowed cursor-pointer"
        >
          {deleting ? "Deleting..." : "Delete channel"}
        </button>
      </div>
    </li>
  );
}
