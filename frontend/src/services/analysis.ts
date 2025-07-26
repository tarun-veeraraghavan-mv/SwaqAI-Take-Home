import axios from "axios";

export async function createAnalysisForVideo(videoId: string) {
  const res = await axios.post(
    `http://localhost:8000/api/analysis/video/${videoId}/create/`
  );

  console.log(res.data);
}
