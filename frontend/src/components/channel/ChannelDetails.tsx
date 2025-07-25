"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChannelDetails({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("PENDING");
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchTaskStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/get-task-status/${taskId}/`
        );

        const taskStatus = res.data.status;
        setStatus(taskStatus);

        if (taskStatus === "SUCCESS") {
          setVideos(res.data.result.videos);
          clearInterval(interval); // stop polling
          setLoading(false);
        } else if (taskStatus === "FAILURE") {
          clearInterval(interval);
          setLoading(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval); // kill polling on error
        setLoading(false);
      }
    };

    interval = setInterval(fetchTaskStatus, 2500);
    fetchTaskStatus(); // hit immediately

    return () => clearInterval(interval);
  }, [taskId]);

  if (loading && status !== "SUCCESS") return <p>⏳ Processing… {status}</p>;

  return (
    <div>
      {loading ? (
        <p>Loading videos for this person.</p>
      ) : (
        <ul>
          {videos?.map((video, idx) => (
            <li key={idx}>
              <p>{video.title}</p>
              <button onClick={() => router.push(`/video/${video.video_id}`)}>
                See video details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
