import VideoTranscriptDisplay from "@/components/video/VideoTranscriptDisplay";
import axios from "axios";
import React from "react";

interface PageProps {
  params: {
    videoId: string;
  };
}

export default async function page({ params }: PageProps) {
  const { videoId } = await params;

  const res = await axios.post(
    "http://localhost:8000/api/fetch-video-transcript-by-id/",
    { video_id: videoId }
  );

  console.log(res);

  return (
    <div>
      <div className="grid grid-cols-3">
        <VideoTranscriptDisplay taskId={res.data.task_id} />
      </div>
    </div>
  );
}
