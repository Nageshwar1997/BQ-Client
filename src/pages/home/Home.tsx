import CategoriesGrid from "./components/categoriesGrid/CategoriesGrid";
import DealForYou from "./components/DealForYou";
import HomeHero from "./components/HomeHero";
import SugarIconic from "./components/SugarIconic";
import VideoCarousel from "./components/VideoCarousel";

const Home = () => {
  return (
    <div className="w-full h-full space-y-5 lg:space-y-10 lg:-mt-16">
      <VideoCarousel />
      <HomeHero />
      <CategoriesGrid />
      <DealForYou />
      <SugarIconic />
    </div>
  );
};

export default Home;
