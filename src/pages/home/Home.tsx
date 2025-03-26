// import VideoCarousel from "./components/VideoCarousel";

import { useEffect } from "react";

const Home = () => {
  const fetchData = async () => {
    const resp = await fetch(
      "https://bq-backend.vercel.app/",
      {
        method: "GET",
      }
    );
    const data = await resp.json();
    console.log("DATA", data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="w-full h-full lg:-mt-16">{/* <VideoCarousel /> */}</div>
  );
};

export default Home;
