"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function VideoTranscriptDisplay({
  video,
  transcript,
  response,
}: {
  video: any;
  transcript: string;
}) {
  const [loading, setLoading] = useState(true);
  // const [transcript, setTranscript] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [episodeId, setEpisodeId] = useState<number | null>(null);

  // useEffect(() => {
  //   const pollTranscriptTask = setInterval(async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8000/api/get-task-status/${taskId}/`
  //       );

  //       if (res.data.status === "SUCCESS") {
  //         const epId = res.data.result.episode_id;
  //         setEpisodeId(epId);

  //         const resTranscript = await axios.get(
  //           `http://localhost:8000/api/get-episode/${epId}/`
  //         );
  //         setTranscript(resTranscript.data.full_text);

  //         clearInterval(pollTranscriptTask);
  //       }
  //     } catch (err) {
  //       console.error("❌ Transcript task polling failed:", err);
  //       clearInterval(pollTranscriptTask);
  //     }
  //   }, 2000);

  //   return () => clearInterval(pollTranscriptTask);
  // }, [taskId]);

  // useEffect(() => {
  //   if (!episodeId) return;

  //   const pollLLMResponse = setInterval(async () => {
  //     try {
  //       const resLLM = await axios.get(
  //         `http://localhost:8000/api/get-llm-response-of-video/${episodeId}/`
  //       );

  //       if (resLLM.data.llm_response !== null) {
  //         setLlmResponse(JSON.stringify(resLLM.data.llm_response, null, 2));
  //         setLoading(false);
  //         clearInterval(pollLLMResponse);
  //       }
  //     } catch (err) {
  //       console.error("❌ LLM polling failed:", err);
  //       clearInterval(pollLLMResponse);
  //     }
  //   }, 2500);

  //   return () => clearInterval(pollLLMResponse);
  // }, [episodeId]);

  return (
    <div className="grid grid-cols-3 gap-5">
      <div>
        <h2 className="font-bold text-xl mb-3">Description of video</h2>
        <p>{video.title}</p>
        <p>{video.description}</p>
        <p>{video.views}</p>
        <p>{video.likes}</p>
      </div>
      <div>
        <h2 className="font-bold text-xl mb-3">Transcript of video</h2>
        <p>{transcript}</p>
      </div>
      <div>
        <h2 className="font-bold text-xl mb-3">Response of video</h2>
      </div>
    </div>
  );
}
