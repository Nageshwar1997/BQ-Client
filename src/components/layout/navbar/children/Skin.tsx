import { SKIN } from '@/constants/navbar.constants';
import { CategoryLabel, SubCategories } from './grand-children';

const Skin = () => {
  return (
    <div className="base:columns-2 columns-1 gap-3 md:columns-3 md:gap-4 lg:columns-4 lg:gap-5">
      {SKIN.subCategories.map((category, index) => (
        <div
          key={index}
          className="border-b-battleship-davys-gray mb-3 break-inside-auto border-b pb-1 md:mb-4 md:pb-2 lg:mb-5"
        >
          <CategoryLabel {...category} className="px-2" />
          <SubCategories {...category} />
        </div>
      ))}
      <div className="break-inside-avoid space-y-3 px-2 md:space-y-4 lg:space-y-5">
        {['moisturizer', 'moisturizer'].map((name, index) => (
          <img
            key={index}
            src={`/images/navbar/${name}.jpg`}
            alt={name}
            className="block w-full cursor-pointer rounded-lg object-contain opacity-80 transition-opacity hover:opacity-100"
            loading="eager"
          />
        ))}
      </div>
    </div>
  );
};

export default Skin;
