// import HomeHero from './HomeHero';
// import HomeVideoCarousel from './HomeVideoCarousel';

import TryOnModal from '@/components/layout/tryons';

// Dev scratch-canvas for building the Try-On flow in isolation - opened by
// default with a mock LIP/MATTE selection so it's visible without going
// through a real product page. Restore the commented-out real homepage below
// once this is done being iterated on here.
const Home = () => {
  return (
    <div className="h-full w-full">
      <TryOnModal
        isOpen
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- always open, nothing to close here
        onClose={() => {}}
        tryOn={{ category: 'FACE', subCategory: 'FOUNDATION' }}
        shades={[
          { name: 'Ruby Red', hexColor: '#B0202E' },
          { name: 'Coral Pink', hexColor: '#F2795D' },
          { name: 'Nude Beige', hexColor: '#C9917A' },
          { name: 'Berry Wine', hexColor: '#7B233F' },
        ]}
      />
    </div>
    // <div className="h-full w-full lg:-mt-16">
    //   <HomeVideoCarousel />
    //   <HomeHero />
    // </div>
  );
};

export default Home;
