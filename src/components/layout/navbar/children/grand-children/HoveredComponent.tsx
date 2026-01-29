import { NAVBAR_CATEGORIES_DATA } from '../../../../../constants';

export const HoveredComponent = ({ index }: { index: number }) => {
  if (index === null || index >= NAVBAR_CATEGORIES_DATA.length) {
    return null;
  }

  const Component = NAVBAR_CATEGORIES_DATA[index].component;

  return (
    <div className="lg:bg-battleship-davys-gray h-full max-w-325 backdrop-blur-3xl lg:rounded-xl lg:p-px">
      <div className="bg-platinum-black text-secondary lg:bg-secondary-invert lg:rounded-xl lg:p-5">
        <Component />
      </div>
    </div>
  );
};
