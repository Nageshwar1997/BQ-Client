import { eyes } from '../../../../constants';
import { CategoryLabel } from './grand-children';
import SubCategories from './grand-children/SubCategories';

const Eyes = () => {
  return (
    <div className="base:grid-cols-2 base:gap-3 grid w-full justify-start gap-2 p-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5 lg:p-0">
      {eyes.subCategories.map((category, index) => (
        <div
          key={index}
          className={`border-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:pb-0 ${
            !['kohl_and_kajal', 'mascaras', 'eyeliners', 'eyeshadow'].includes(category.category)
              ? 'lg:border-none'
              : 'lg:pb-2'
          }`}
        >
          <CategoryLabel {...category} />
          <SubCategories {...category} l1Cat="eyes" />
        </div>
      ))}
      <div className="shadow-secondary-invert col-span-2 hidden max-h-46 w-full items-center gap-5 shadow-lg lg:flex xl:max-h-62.5">
        <img
          src="/images/navbar/Mascara.jpg"
          alt="Mascara"
          className="h-full max-w-[calc(50%-10px)] cursor-pointer rounded-lg object-fill object-center opacity-95 hover:opacity-100"
          loading="lazy"
        />
        <img
          src="/images/navbar/Mascara.jpg"
          alt="Mascara"
          className="h-full max-w-[calc(50%-10px)] cursor-pointer rounded-lg object-fill object-center opacity-95 hover:opacity-100"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Eyes;
