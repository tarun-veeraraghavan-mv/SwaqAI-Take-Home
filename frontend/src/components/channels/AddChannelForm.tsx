"use client";

import { AddChannelFormProps } from "@/types/channels";
import axios from "axios";
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

      const res = await axios.post(
        "http://localhost:8000/api/get-channel-details/",
        {
          handle: channelName,
        }
      );

      console.log(res.data);
      onAddChannels(res.data.channel);
    } catch (err) {
      console.log(err);
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
              {loading ? "Adding channel" : "Add channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
