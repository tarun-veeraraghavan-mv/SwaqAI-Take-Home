import AnalysisTabComponent from "@/components/analysis/AnalysisTabComponent";
import Header from "@/components/ui/Header";
import SubText from "@/components/ui/SubText";

interface PageProps {
  params: {
    episodeId: string;
  };
}

export default function page({ params }: PageProps) {
  const { episodeId } = params;

  return (
    <div className="max-w-[1150px] mx-auto px-[32px] py-5">
      <Header>Episode Details</Header>
      <SubText>Learn about the episode and its connect</SubText>
      <div>
        <AnalysisTabComponent episodeId={episodeId} />
      </div>
    </div>
  );
}
