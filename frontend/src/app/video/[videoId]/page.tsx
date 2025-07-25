import VideoTranscriptDisplay from "@/components/video/VideoTranscriptDisplay";
import {
  getLLMResponseByVideoId,
  getTranscriptByVideoId,
  getVideoDetails,
} from "@/services/videos";

interface PageProps {
  params: {
    videoId: string;
  };
}

export default async function page({ params }: PageProps) {
  const { videoId } = await params;

  const [data2, transcript] = await Promise.all([
    getVideoDetails(videoId),
    getTranscriptByVideoId(videoId),
  ]);
  const video = data2.video;

  return (
    <div>
      <div>
        <VideoTranscriptDisplay
          // taskId={data1.task_id}
          video={video}
          transcript={transcript}
        />
      </div>
    </div>
  );
}
