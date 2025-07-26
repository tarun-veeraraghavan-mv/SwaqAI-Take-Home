interface PageProps {
  params: {
    videoId: string;
  };
}

export default function page({ params }: PageProps) {
  const { videoId } = params;

  return (
    <div>
      <p>{videoId}</p>
    </div>
  );
}
