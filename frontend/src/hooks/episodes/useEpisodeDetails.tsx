import { getVideoDetails } from "@/services/videos";
import { EpisodeDetail } from "@/types/episodes";
import { useEffect, useState } from "react";

export function useEpisodeDetails(episodeId: string) {
  const [loading, setLoading] = useState(false);
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);

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

  return { loading, episode };
}
