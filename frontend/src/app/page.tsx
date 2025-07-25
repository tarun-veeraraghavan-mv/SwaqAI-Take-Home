import UserChannelsListView from "@/components/channels/UserChannelsListView";
import axios from "axios";

export default async function Home() {
  const res = await axios.get(
    "http://localhost:8000/api/get-channels-for-user/"
  );

  console.log(res.data.channels);

  return (
    <div className="max-w-[1150px] mx-auto px-[32px]">
      <UserChannelsListView />
    </div>
  );
}
