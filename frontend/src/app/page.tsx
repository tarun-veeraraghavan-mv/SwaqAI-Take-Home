import UserChannelsListView from "@/components/channels/UserChannelsListView";
import Header from "@/components/ui/Header";
import SubText from "@/components/ui/SubText";
import axios from "axios";

export default async function Home() {
  const res = await axios.get(
    "http://localhost:8000/api/get-channels-for-user/"
  );

  console.log(res.data.channels);

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
