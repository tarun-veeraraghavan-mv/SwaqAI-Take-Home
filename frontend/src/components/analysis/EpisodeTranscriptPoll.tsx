import { getTranscriptForVideoPolling } from "@/services/analysis";
import React, { useEffect, useState } from "react";

export default function EpisodeTranscriptPoll({
  episodeId,
}: {
  episodeId: string;
}) {
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getTranscriptForVideoPolling(episodeId);

      const taskId = data.taskId;
    });
  });

  return <div>EpisodeTranscriptPoll</div>;
}
