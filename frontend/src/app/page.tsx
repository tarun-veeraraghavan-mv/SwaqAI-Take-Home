import UserChannelsListView from "@/components/channels/UserChannelsListView";
import Header from "@/components/ui/Header";
import SubText from "@/components/ui/SubText";

export default async function Home() {
  return (
    <div className="max-w-[1150px] mx-auto px-[32px] py-5">
      <Header>Select channels</Header>
      <SubText>
        Choose the channels you like to follow. We&apos;ll fetch the episodes
        for you
      </SubText>
      <UserChannelsListView />
    </div>
  );
}
