import React, { useState } from "react";

export default function TextTruncator({ textBlock }: { textBlock?: string }) {
  const [truncateText, setTruncateText] = useState(true);

  return (
    <div className="mb-6">
      <p className="font-bold text-3xl mb-3">Description</p>
      <div>
        <p>
          {truncateText
            ? textBlock?.slice(0, 500) + "..."
            : textBlock?.slice(0, -1)}
        </p>
        <button
          onClick={() => setTruncateText(truncateText ? false : true)}
          className="font-bold cursor-pointer"
        >
          {truncateText ? "Show more..." : "Show less.."}
        </button>
      </div>
    </div>
  );
}
