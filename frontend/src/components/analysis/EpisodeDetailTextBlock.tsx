import { EpisodeDetailTextBlockProps } from "@/types/episodes";

export default function EpisodeDetailTextBlock({
  content,
  title,
}: EpisodeDetailTextBlockProps) {
  return (
    <div className="mb-6">
      <p className="font-bold text-3xl mb-3">{title}</p>
      <p>{content}</p>
    </div>
  );
}
