"use client";

import { getTranscriptByVideoId } from "@/services/videos";
import React, { useEffect, useState } from "react";

export default function EpisodeTranscript({
  episodeId,
}: {
  episodeId: string;
}) {
  const [episodeTranscript, setEpisodeTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    async function fetchVideoDetails() {
      try {
        const data = await getTranscriptByVideoId(episodeId);
        setEpisodeTranscript(data);
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
        <p>Loading...</p>
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
