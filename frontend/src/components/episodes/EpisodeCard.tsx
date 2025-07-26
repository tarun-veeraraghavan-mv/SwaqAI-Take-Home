import { EpisodeCardProps } from "@/types/episodes";
import { useRouter } from "next/navigation";
import React from "react";

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const router = useRouter();

  return (
    <li>
      <img src={episode.thumbnail} alt="Thumbnail" />
      <p className="font-bold mb-3">{episode.title}</p>
      <div className="flex justify-between">
        <button
          onClick={() => router.push(`/analysis/${episode.video_id}`)}
          className="bg-blue-400 text-white font-bold p-1 rounded-full"
        >
          Analyze video
        </button>
        <a
          href={episode.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white font-bold p-1 rounded-full"
        >
          View video
        </a>
      </div>
    </li>
  );
}
