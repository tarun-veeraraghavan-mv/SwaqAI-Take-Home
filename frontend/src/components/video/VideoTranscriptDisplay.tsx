"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function VideoTranscriptDisplay({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState("");
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
          setTranscript(res.data.result);
          console.log(res.data);
          clearInterval(interval);
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
        <p>Loading...</p>
      ) : (
        <div>
          <p>📜 Transcript:</p>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
