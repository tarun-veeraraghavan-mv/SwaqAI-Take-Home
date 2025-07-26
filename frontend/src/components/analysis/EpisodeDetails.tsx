"use client";

import { getVideoDetails } from "@/services/videos";
import { EpisodeDetail } from "@/types/episodes";
import { useEffect, useState } from "react";

export default function EpisodeDetails({ episodeId }: { episodeId: string }) {
  const [loading, setLoading] = useState(false);
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [truncateText, setTruncateText] = useState(true);

  useEffect(() => {
    setLoading(true);

    async function fetchVideoDetails() {
      try {
        const data = await getVideoDetails(episodeId);
        setEpisode(data.video);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoDetails();
  }, [episodeId]);

  return (
    <div>
      {loading ? (
        <p className="py-6">Loading video details</p>
      ) : (
        <div className="py-6">
          <div className="mb-6">
            <p className="font-bold text-3xl mb-3">Episode Title</p>
            <p>{episode?.title}</p>
          </div>

          <div className="mb-6">
            <p className="font-bold text-3xl mb-3">Description</p>
            <div>
              <p>
                {truncateText
                  ? episode?.description.slice(0, 500) + "..."
                  : episode?.description.slice(0, -1)}
              </p>
              <button
                onClick={() => setTruncateText(truncateText ? false : true)}
                className="font-bold cursor-pointer"
              >
                {truncateText ? "Show more..." : "Show less.."}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <p className="font-bold text-3xl mb-3">Upload at</p>
            <p>{episode?.published}</p>
          </div>
          <div className="mb-6">
            <p className="font-bold text-3xl mb-3">Views</p>
            <p>{episode?.views} viewers</p>
          </div>
          <div className="mb-6">
            <p className="font-bold text-3xl mb-3">Likes</p>
            <p>{episode?.likes} user likes</p>
          </div>
        </div>
      )}
    </div>
  );
}
