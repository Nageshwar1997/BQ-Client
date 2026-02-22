import { skin } from '../../../../Constants';
import { CategoryLabel, Feedback, SubCategories } from './grand-children';

export const Skin = () => {
  return (
    <div className="h-full w-full space-y-4 p-4 lg:p-0">
      <div className="base:grid-cols-2 base:gap-3 grid w-full justify-start gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
        {skin.subCategories.map((category, index) => (
          <div
            key={index}
            className="border-primary-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:border-none lg:pb-0"
          >
            <CategoryLabel {...category} />
            <SubCategories {...category} l1Cat="skin" />
          </div>
        ))}
        <div className="shadow-secondary-inverted col-span-2 hidden max-h-62.5 w-full items-center gap-4 shadow-lg md:flex lg:hidden">
          {['moisturizer', 'moisturizer'].map((name, index) => (
            <img
              key={index}
              src={`/images/navbar/${name}.jpg`}
              alt={name}
              className="h-full max-w-75 min-w-50 cursor-pointer rounded-lg object-fill opacity-95 hover:opacity-100"
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <Feedback />
    </div>
  );
};
