import { fetchUserChannels } from "@/services/channels";
import { Channel } from "@/types/channels";
import axios from "axios";
import { useEffect, useState } from "react";

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchChannelsForUser() {
      try {
        setLoading(true);

        const data = await fetchUserChannels();
        setChannels(data.channels);
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

  return { channels, loading, handleAddChannels, handleDeleteChannel };
}
