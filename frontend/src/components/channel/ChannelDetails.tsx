"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ChannelDetails({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("PENDING");

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
      <h2>✅ Videos fetched:</h2>
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <ul>
          {videos.map((video, idx) => (
            <li key={idx}>{video.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
