export interface Episode {
  title: string;
  video_id: string;
  video_url: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  published_at: string;
}

export interface EpisodeCardProps {
  episode: Episode;
}

export interface EpisodePaginationButtonProps {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  currentPage: number;
  totalPages: number;
}
