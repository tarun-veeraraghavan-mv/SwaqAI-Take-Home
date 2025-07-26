import EpisodeList from "@/components/episodes/EpisodeList";
import Header from "@/components/ui/Header";
import SubText from "@/components/ui/SubText";
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
    <div className="max-w-[1150px] mx-auto px-[32px] py-5">
      <Header>Episodes</Header>
      <SubText>Explore the latest videos from your channel</SubText>
      <EpisodeList taskId={taskId} />
    </div>
  );
}
