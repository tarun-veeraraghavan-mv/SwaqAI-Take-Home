"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddYoutubeChannelInput() {
  const [youtubeChannel, setYoutubeChannel] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:8000/api/fetch-youtube-videos-from-channel-url/",
      {
        channel_url: youtubeChannel,
      }
    );

    console.log(res.data);
    router.push(`/channel/${res.data.task_id}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Add the URL of your Youtube Channel</label>
          <input
            type="text"
            value={youtubeChannel}
            onChange={(e) => setYoutubeChannel(e.target.value)}
          />
        </div>
        <div>
          <button className="font-bold text-red-500">Submit</button>
        </div>
      </form>
    </div>
  );
}
