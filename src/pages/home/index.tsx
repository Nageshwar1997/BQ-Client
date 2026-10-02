import HomeHero from './HomeHero';

// Dev scratch-canvas for building the Try-On flow in isolation - opened by
// default with a mock LIP/MATTE selection so it's visible without going
// through a real product page. Restore the commented-out real homepage below
// once this is done being iterated on here.
const Home = () => {
  return (
    <div className="h-full w-full lg:-mt-16">
      {/* <HomeVideoCarousel /> */}
      <HomeHero />
    </div>
  );
};

export default Home;
