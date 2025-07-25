import React from "react";
import ChannelCard from "./ChannelCard";
import { ChannelListProps } from "@/types/channels";

export default function ChannelList({
  channels,
  onDeleteChannel,
}: ChannelListProps) {
  return (
    <ul className="grid grid-cols-3 gap-5">
      {channels?.map((channel, id) => (
        <ChannelCard
          channel={channel}
          onDeleteChannel={onDeleteChannel}
          key={id}
        />
      ))}
    </ul>
  );
}
