"use client";

import { addChannelForUser } from "@/services/channels";
import { AddChannelFormProps } from "@/types/channels";
import { AxiosError } from "axios";
import { useState } from "react";

export default function AddChannelForm({ onAddChannels }: AddChannelFormProps) {
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!channelName) {
      return;
    }

    try {
      setLoading(true);

      const data = await addChannelForUser(channelName);
      onAddChannels(data.channel);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="channelName">Channel name</label>
            <input
              type="text"
              name="channelName"
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          <div>
            <button disabled={loading}>
              {loading ? "Adding channel..." : "Add channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
