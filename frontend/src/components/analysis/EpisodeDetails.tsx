"use client";

import { useEpisodeDetails } from "@/hooks/episodes/useEpisodeDetails";
import { useState } from "react";
import EpisodeDetailTextBlock from "./EpisodeDetailTextBlock";
import TextTruncator from "../ui/TextTruncator";

export default function EpisodeDetails({ episodeId }: { episodeId: string }) {
  const { loading, episode } = useEpisodeDetails(episodeId);

  return (
    <div>
      {loading ? (
        <p className="py-6">Loading video details</p>
      ) : (
        <div className="py-6">
          <EpisodeDetailTextBlock
            content={episode?.title}
            title="Episode title"
          />

          <TextTruncator textBlock={episode?.description} />

          <EpisodeDetailTextBlock
            title="Uploaded at"
            content={episode?.published}
          />
          <EpisodeDetailTextBlock
            title="Views"
            content={`${episode?.views} viewers`}
          />
          <EpisodeDetailTextBlock
            title="Likes"
            content={`${episode?.likes} likes`}
          />
        </div>
      )}
    </div>
  );
}
