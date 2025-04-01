import CategoriesGrid from "./components/categoriesGrid/CategoriesGrid";
import DealForYou from "./components/DealForYou";
import HomeHero from "./components/HomeHero";
import VideoCarousel from "./components/VideoCarousel";

const Home = () => {
  return (
    <div className="w-full h-full space-y-10 lg:-mt-16">
      <VideoCarousel />
      <HomeHero />
      <CategoriesGrid />
      <DealForYou />
    </div>
  );
};

export default Home;
