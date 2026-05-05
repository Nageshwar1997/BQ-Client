import { LIPS } from '@/constants/navbar.constants';
import { CategoryLabel, SubCategories } from './grand-children';

const Lips = () => {
  return (
    <div className="base:grid-cols-2 base:gap-3 grid h-full w-full grid-cols-1 content-center gap-2 p-4 md:grid-cols-3 md:gap-4 lg:gap-5 lg:p-0 xl:grid-cols-4">
      {LIPS.subCategories.map((category, index) => {
        return (
          <div
            key={index}
            className={`border-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:pb-0 ${
              ['finish_types', 'lipstick_forms', 'long_lasting_lipsticks', 'lip_care'].includes(
                category.category,
              )
                ? category.category === 'lip_care'
                  ? '2xl:border-battleship-davys-gray lg:border-transparent lg:pb-0 2xl:pb-2'
                  : 'lg:pb-2'
                : 'lg:border-none'
            }`}
          >
            <CategoryLabel {...category} />
            <SubCategories {...category} />
          </div>
        );
      })}
      <div className="shadow-secondary-invert col-span-2 hidden max-h-46 w-full items-center gap-5 shadow-lg xl:flex xl:max-h-62.5">
        {['Lipstick1', 'Lipstick2'].map((name) => (
          <img
            key={name}
            src={`/images/navbar/${name}.jpg`}
            alt={name}
            className="h-full max-w-[calc(50%-10px)] cursor-pointer rounded-lg object-fill object-center opacity-95 hover:opacity-100"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default Lips;
