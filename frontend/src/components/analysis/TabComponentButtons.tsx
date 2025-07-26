import { TabComponentButtonsProps } from "@/types/analysis";
import React from "react";

export default function TabComponentButtons({
  currentTab,
  setCurrentTab,
}: TabComponentButtonsProps) {
  return (
    <div className="flex gap-3 border-b-2 border-b-gray-300">
      <p
        className={`font-[600] text-gray-500 py-4 px-2 cursor-pointer hover:bg-gray-100 ${
          currentTab === "details" ? "border-b-4  border-b-gray-700" : ""
        }`}
        onClick={() => setCurrentTab("details")}
      >
        Details
      </p>
      <p
        className={`font-[600] text-gray-500 py-4 px-2 cursor-pointer hover:bg-gray-100 ${
          currentTab === "transcript" ? "border-b-2  border-b-gray-700" : ""
        }`}
        onClick={() => setCurrentTab("transcript")}
      >
        Transcript
      </p>
      <p
        className={`font-[600] text-gray-500 py-4 px-2 cursor-pointer hover:bg-gray-100  ${
          currentTab === "keyQuestions" ? "border-b-2  border-b-gray-700" : ""
        }`}
        onClick={() => setCurrentTab("keyQuestions")}
      >
        Key Questions
      </p>
    </div>
  );
}
