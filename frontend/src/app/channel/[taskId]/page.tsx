import ChannelDetails from "@/components/channel/ChannelDetails";
import React from "react";

interface PageProps {
  params: {
    taskId: string;
  };
}

export default function page({ params }: PageProps) {
  const { taskId } = params;
  console.log(taskId);

  return (
    <div>
      <ChannelDetails taskId={taskId} />
    </div>
  );
}
