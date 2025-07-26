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

export interface EpisodeDetail {
  title: string;
  description: string;
  views: number;
  likes: number;
  duration: string;
  published: string;
  thumbnail: string;
}

export interface EpisodeDetailTextBlockProps {
  title?: string;
  content?: string;
}
