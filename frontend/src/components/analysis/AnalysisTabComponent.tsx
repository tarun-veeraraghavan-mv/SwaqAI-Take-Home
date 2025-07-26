"use client";

import { useState } from "react";
import EpisodeDetails from "./EpisodeDetails";
import EpisodeTranscript from "./EpisodeTranscript";
import TabComponentButtons from "./TabComponentButtons";
import { createAnalysisForVideo } from "@/services/analysis";

export default function AnalysisTabComponent({
  episodeId,
}: {
  episodeId: string;
}) {
  const [currentTab, setCurrentTab] = useState("details");

  return (
    <div>
      <TabComponentButtons
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
      />

      {currentTab === "details" && <EpisodeDetails episodeId={episodeId} />}
      {currentTab === "transcript" && (
        <EpisodeTranscript episodeId={episodeId} />
      )}
      {currentTab === "keyQuestions" && (
        <div>
          <button onClick={() => createAnalysisForVideo(episodeId)}>
            Create analaysis
          </button>
        </div>
      )}
    </div>
  );
}
