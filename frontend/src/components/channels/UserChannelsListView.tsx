"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import ChannelList from "./ChannelList";
import { Channel } from "@/types/channels";
import AddChannelForm from "./AddChannelForm";

export default function UserChannelsListView() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchChannelsForUser() {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:8000/api/get-channels-for-user/"
        );

        console.log(res.data);
        setChannels(res.data.channels);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChannelsForUser();
  }, []);

  function handleAddChannels(channel: Channel) {
    setChannels((prev) => [...prev, channel]);
  }

  function handleDeleteChannel(channelId: number) {
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
  }

  return (
    <div>
      <div>
        <AddChannelForm onAddChannels={handleAddChannels} />
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ChannelList
            channels={channels}
            onDeleteChannel={handleDeleteChannel}
          />
        )}
      </div>
    </div>
  );
}
