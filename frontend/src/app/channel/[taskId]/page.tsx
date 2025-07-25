import ChannelDetails from "@/components/channel/ChannelDetails";
import React from "react";

interface PageProps {
  params: {
    taskId: string;
  };
}

export default async function page({ params }: PageProps) {
  const { taskId } = await params;
  console.log(taskId);

  return (
    <div className="max-w-[1150px] mx-auto px-[32px]">
      <ChannelDetails taskId={taskId} />
    </div>
  );
}
