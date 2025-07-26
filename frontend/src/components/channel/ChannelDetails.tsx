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
    const interval = setInterval(async () => {
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
    }, 2500);

    return () => clearInterval(interval);
  }, [taskId]);

  if (loading && status !== "SUCCESS") return <p>⏳ Processing… {status}</p>;

  return (
    <div>
      {loading ? (
        <p>Loading videos for this person.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-5">
          {videos?.map((video, idx) => (
            <li key={idx}>
              <img src={video.thumbnail} alt="Thumbnail" />
              <p>{video.title}</p>
              <div className="flex justify-between">
                <button onClick={() => router.push(`/video/${video.video_id}`)}>
                  Analyze video
                </button>
                <a href={video.video_url} target="_blank">
                  View video
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
