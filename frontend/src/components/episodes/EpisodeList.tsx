"use client";

import { useEpisodes } from "@/hooks/episodes/useEpisodes";
import { useState } from "react";
import EpisodeCard from "./EpisodeCard";
import EpisodePaginationButton from "./EpisodePaginationButton";

export default function EpisodeList({ taskId }: { taskId: string }) {
  const { loading, episodes } = useEpisodes(taskId);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 6; // Number of episodes per page

  // Calculate the episodes to display for the current page
  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = episodes?.slice(
    indexOfFirstEpisode,
    indexOfLastEpisode
  );

  // Calculate total pages
  const totalPages = episodes
    ? Math.ceil(episodes.length / episodesPerPage)
    : 1;

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading videos for this person.</p>
      ) : (
        <>
          <ul className="grid grid-cols-3 gap-5">
            {currentEpisodes?.map((episode, id) => (
              <EpisodeCard episode={episode} key={id} />
            ))}
          </ul>

          <EpisodePaginationButton
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
