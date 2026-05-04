import {
  BRONZERS_AND_CONTOURS,
  CHEEKS_AND_GLOW,
  CONCEALERS_AND_CORRECTORS,
  FACE_MAKEUP,
  FOUNDATIONS_BY_FINISH,
  FOUNDATIONS_BY_SKIN_TYPE,
  PRIMERS_AND_REMOVERS,
  SETTING_AND_FINISHING,
  TRADITIONAL_AND_ESSENTIALS,
} from '@/constants/navbar.constants';
import { CategoryLabel, SubCategories } from './grand-children';

const categories = [
  [FACE_MAKEUP, TRADITIONAL_AND_ESSENTIALS],
  [CHEEKS_AND_GLOW, SETTING_AND_FINISHING],
  [FOUNDATIONS_BY_FINISH, FOUNDATIONS_BY_SKIN_TYPE],
  [PRIMERS_AND_REMOVERS, BRONZERS_AND_CONTOURS, CONCEALERS_AND_CORRECTORS],
];

const Face = () => {
  return (
    <div className="base:grid-cols-2 base:gap-3 grid h-full w-full grid-cols-1 content-center gap-2 p-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5 lg:p-0">
      {categories.map((item, i) => (
        <div
          key={i}
          className={`flex flex-col gap-2 ${
            i === 3
              ? 'md:col-span-3 md:flex-row md:justify-around md:gap-4 lg:col-span-1 lg:flex-col lg:justify-start lg:gap-4.5 xl:gap-6'
              : ''
          }`}
        >
          {item.map((category, index) => (
            <div
              key={index}
              className={`border-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:pb-0 ${
                [
                  'traditional_and_essentials',
                  'setting_and_finishing',
                  'foundations_by_skin_type',
                  'concealers_and_correctors',
                ].includes(category.category)
                  ? 'lg:border-none'
                  : 'lg:pb-2'
              } ${category.category === 'foundations_by_skin_type' ? 'base:pb-5.75 md:pb-4' : ''}`}
            >
              <CategoryLabel {...category} />
              <SubCategories {...category} l1Cat="face" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Face;
