import AnalysisTabComponent from "@/components/analysis/AnalysisTabComponent";
import Header from "@/components/ui/Header";
import SubText from "@/components/ui/SubText";
import { hello } from "@/services/channels";

interface PageProps {
  params: {
    episodeId: string;
  };
}

export default async function page({ params }: PageProps) {
  const { episodeId } = await params;

  const takila = await hello();
  console.log(takila);

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
