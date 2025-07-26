"use client";

import { useEpisodeTranscript } from "@/hooks/episodes/useEpisodeTranscript";

export default function EpisodeTranscript({
  episodeId,
}: {
  episodeId: string;
}) {
  const { loading, episodeTranscript } = useEpisodeTranscript(episodeId);

  return (
    <div>
      {loading ? (
        <p className="py-6">Loading...</p>
      ) : (
        <div className="py-6">
          <div className="mb-6">
            <p className="font-bold text-3xl mb-3">Episode Transcript</p>
            <p>{episodeTranscript}</p>
          </div>
        </div>
      )}
    </div>
  );
}
