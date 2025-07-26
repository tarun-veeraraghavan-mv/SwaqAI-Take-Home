"use client";

import { useChannels } from "@/hooks/useChannels";
import AddChannelForm from "./AddChannelForm";
import ChannelList from "./ChannelList";
import { useState } from "react";

export default function UserChannelsListView() {
  const [searchChannelInput, setSearchChannelInput] = useState("");
  const { handleAddChannels, handleDeleteChannel, loading, channels } =
    useChannels();

  const filteredChannels = searchChannelInput
    ? channels.filter((c) =>
        c.title.toLowerCase().includes(searchChannelInput.toLowerCase())
      )
    : channels;

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search your channels..."
          value={searchChannelInput}
          onChange={(e) => setSearchChannelInput(e.target.value)}
          className="py-2 px-3 bg-gray-200 outline-none w-[100%] text-md rounded-md"
        />
      </div>
      <div>
        <AddChannelForm onAddChannels={handleAddChannels} />
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className="font-bold text-xl mb-4">Your channels</p>
            <ChannelList
              channels={filteredChannels}
              onDeleteChannel={handleDeleteChannel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
