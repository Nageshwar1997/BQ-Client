import HomeHero from "./components/HomeHero";
import VideoCarousel from "./components/VideoCarousel";

const Home = () => {
  return (
    <div className="w-full h-full lg:-mt-16">
      <VideoCarousel />
      <HomeHero />
    </div>
  );
};

export default Home;
