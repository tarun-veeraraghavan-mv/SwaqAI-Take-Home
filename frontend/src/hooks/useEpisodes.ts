import { Episode } from "@/types/episodes";
import axios from "axios";
import { useEffect, useState } from "react";

export function useEpisodes(taskId: string) {
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [status, setStatus] = useState<string>("PENDING");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/get-task-status/${taskId}/`
        );

        const taskStatus = res.data.status;
        setStatus(taskStatus);

        if (taskStatus === "SUCCESS") {
          setEpisodes(res.data.result.videos);
          clearInterval(interval);
          setLoading(false);
        } else if (taskStatus === "FAILURE") {
          clearInterval(interval);
          setLoading(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval);
        setLoading(false);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [taskId]);

  return { loading, episodes, status };
}
