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
      setChannelName("");
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.error);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <input
            type="text"
            name="channelName"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Add a new channel by giving their name"
            className="py-2 px-3 outline-none w-[400px] text-md rounded-md border-2 border-gray-200"
          />

          <button
            disabled={loading}
            className="py-2 px-3 bg-indigo-400 font-bold text-white rounded-lg"
          >
            {loading ? "Adding channel..." : "Add channel"}
          </button>
        </div>
      </form>
    </div>
  );
}
