import { getTranscriptByVideoId } from "@/services/videos";
import { useEffect, useState } from "react";

export function useEpisodeTranscript(episodeId: string) {
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

  return { episodeTranscript, loading };
}
