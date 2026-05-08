import { FACE } from '@/constants/navbar.constants';
import { CategoryLabel, SubCategories } from './grand-children';

const Face = () => {
  return (
    <div className="base:columns-2 columns-1 gap-3 md:columns-3 md:gap-4 lg:columns-4 lg:gap-5">
      {FACE.subCategories.map((category, index) => (
        <div
          key={index}
          className="border-b-battleship-davys-gray mb-3 break-inside-auto border-b pb-1 md:mb-4 md:pb-2 lg:mb-5"
        >
          <CategoryLabel {...category} className="px-2" />
          <SubCategories {...category} />
        </div>
      ))}
    </div>
  );
};

export default Face;
