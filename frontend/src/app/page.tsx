import UserChannelsListView from "@/components/channels/UserChannelsListView";
import axios from "axios";

export default async function Home() {
  const res = await axios.get(
    "http://localhost:8000/api/get-channels-for-user/"
  );

  console.log(res.data.channels);

  return (
    <div>
      <UserChannelsListView />
    </div>
  );
}
