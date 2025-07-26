import { EpisodePaginationButtonProps } from "@/types/episodes";
import React from "react";

export default function EpisodePaginationButton({
  handleNextPage,
  handlePrevPage,
  currentPage,
  totalPages,
}: EpisodePaginationButtonProps) {
  return (
    <div className="mt-4 flex justify-between items-center">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 bg-gray-200 rounded ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
        }`}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-gray-200 rounded ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );
}
