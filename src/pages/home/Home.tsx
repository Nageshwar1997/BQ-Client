import CloudinaryVideoCarousel from "./components/CloudinaryVideoCarousel";
// import VideoCarousel from "./components/VideoCarousel";

const Home = () => {
  return (
    <div className="w-full h-full lg:-mt-16">
      <div className="w-full h-[500px]">
        <CloudinaryVideoCarousel />
      </div>
    </div>
  );
};

export default Home;
