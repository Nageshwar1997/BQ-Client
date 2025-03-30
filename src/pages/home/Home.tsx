import CategoriesGrid from "./components/categoriesGrid/CategoriesGrid";
import HomeHero from "./components/HomeHero";
import VideoCarousel from "./components/VideoCarousel";

const Home = () => {
  return (
    <div className="w-full h-full space-y-10 lg:-mt-16">
      <VideoCarousel />
      <HomeHero />
      <CategoriesGrid />
    </div>
  );
};

export default Home;
