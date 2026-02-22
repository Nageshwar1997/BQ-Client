import { Link } from 'react-router-dom';
import type { ICategoryL3, TCategoryBaseL, TClassName, TForwardIdx } from '../../../../../types';
import { getTodaysFeedback, isHighlightedCategory } from '../../../../../utils';
import {
  BuildingIcon,
  HeartIcon,
  MessageIcon,
  SearchIcon,
  ShoppingBag,
  UserCircleIcon,
} from '../../../../../icons';
import { GradientText, Theme } from '../../../../ui';
import { HIGHLIGHTED_CATEGORIES, NAVBAR_CATEGORIES_DATA } from '../../../../../constants';
import { Hook } from '../../../../../hooks';
import { useEffect, useState } from 'react';
import { SearchModal, UserPopupModal } from '../../../modals';

export const CategoryLabel = ({
  label,
  path = '',
  className = '',
}: Pick<TCategoryBaseL, 'path' | 'label'> & TClassName) => (
  <p
    className={`text-battleship-davys-gray-invert mt-3 line-clamp-1 px-3 text-left text-sm leading-5 font-semibold tracking-wide uppercase md:mt-0 ${
      path ? 'cursor-pointer' : 'cursor-default'
    } ${className}`}
  >
    {path ? <Link to={path}>{label}</Link> : label}
  </p>
);

export const Feedback = ({ forwardIndex = 0 }: { forwardIndex?: TForwardIdx }) => {
  const FEEDBACK = getTodaysFeedback(forwardIndex);
  return (
    <div className="border-primary/50 flex w-full flex-col gap-2 border-b pt-0 pb-4 lg:flex-row lg:items-center lg:border-t lg:border-b-transparent lg:pt-4 lg:pb-0">
      <div className="flex w-fit items-center gap-2">
        <MessageIcon className="fill-secondary size-4 2xl:size-5" />
        <p className="text-secondary text-sm font-medium text-nowrap lg:text-[11px] xl:text-sm">
          User's Feedback:
        </p>
      </div>
      {FEEDBACK.map((item) => (
        <GradientText
          key={item.text}
          text={item.text}
          type={item.accent ? 'accent' : 'silver'}
          className="text-[11px] xl:text-sm"
        />
      ))}
    </div>
  );
};

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

export const SubCategories = ({
  subCategories,
  className = '',
  l1Cat,
}: TClassName & {
  subCategories: ICategoryL3[];
  l1Cat?: keyof typeof HIGHLIGHTED_CATEGORIES;
}) => {
  const { navigate } = Hook.PathParams();
  return (
    <div className={`flex flex-col gap-1 md:gap-2 ${className}`}>
      {subCategories.map((subCategory, index) => {
        const isHighlighted = isHighlightedCategory(subCategory.category, l1Cat);
        const Icon = subCategory.icon;
        return (
          <div
            onClick={() => subCategory?.path && navigate(subCategory.path)}
            key={index}
            className={`hover:bg-smoke-eerie flex cursor-pointer justify-start gap-2 rounded-xl border border-transparent p-2 ${
              isHighlighted ? 'hover:border-blue-crayola-c' : 'hover:border-primary/8'
            } group`}
          >
            <div
              className={`bg-secondary-invert group-hover:bg-primary-invert flex size-10 items-center justify-center rounded-lg xl:size-12 ${
                isHighlighted
                  ? 'bg-accent-duo group-hover:shadow-primary-btn-hover [&>svg]:fill-white'
                  : 'shadow-battleship-davys-gray shadow-inner'
              }`}
            >
              <Icon className="fill-secondary" />
            </div>
            <div className="flex w-full flex-col justify-center lg:justify-start">
              <p className="text-secondary group-hover:text-primary line-clamp-1 w-full text-left text-xs tracking-wide xl:text-sm">
                {subCategory.label}
              </p>
              <p className="text-silver-jet group-hover:text-tertiary line-clamp-2 text-[8px] leading-3 wrap-break-word xl:text-[10px]">
                {subCategory.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CountBadge = ({ count }: { count?: number | string }) => {
  if (!count) return null;
  <GradientText
    text={`${count}`}
    type="accent"
    className="pointer-events-none absolute inset-x-0 bottom-0.5 mx-auto w-fit text-[11px] leading-none font-semibold md:bottom-0.75"
  />;
};

export const UserMenuIcons = ({
  className,
  closeOnNavbarLeave,
}: {
  className?: string;
  closeOnNavbarLeave?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState({
    search: false,
    user: false,
  });
  const userPopupRef = Hook.OutsideClick<HTMLDivElement>(() => {
    setIsOpen((prev) => ({ ...prev, user: false }));
  });
  const { paths, navigate } = Hook.PathParams();
  const requireAuth = Hook.RequireAuth();
  //   const { cart } = useCartStore();
  //   const { wishlist } = useWishlistStore();

  const handleAuthNavigation = (path: string) => {
    const action = () => navigate(path); // wrap in a function
    if (!requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
  };

  useEffect(() => {
    if (closeOnNavbarLeave) {
      setIsOpen({ search: false, user: false });
    }
  }, [closeOnNavbarLeave]);

  return (
    <>
      <SearchModal
        isOpen={isOpen.search}
        onClose={() => setIsOpen((prev) => ({ ...prev, search: false }))}
      />
      <div className={`flex gap-2 md:gap-3 xl:gap-5 ${className}`}>
        {!paths.includes('search') && (
          <SearchIcon
            onClick={() => setIsOpen((prev) => ({ ...prev, search: true }))}
            className="stroke-tertiary size-5 cursor-pointer md:h-6 md:w-6"
          />
        )}
        <div className="relative" ref={userPopupRef}>
          <UserCircleIcon
            onClick={() => setIsOpen((prev) => ({ ...prev, user: true }))}
            className={`size-5 cursor-pointer md:h-6 md:w-6 ${
              isOpen.user ? 'stroke-blue-crayola-c' : 'stroke-tertiary hover:stroke-secondary'
            }`}
          />
          <UserPopupModal
            isOpen={isOpen.user}
            onClose={() => setIsOpen((prev) => ({ ...prev, user: false }))}
          />
        </div>
        <BuildingIcon
          className="stroke-tertiary size-5 cursor-pointer md:h-6 md:w-6"
          onClick={() => navigate('/become-seller')}
        />
        <div className="relative">
          <ShoppingBag
            onClick={() => handleAuthNavigation('/cart')}
            className="stroke-tertiary size-5 cursor-pointer md:h-6 md:w-6"
          />
          <CountBadge
            count={
              // cart?.products?.length
              0
            }
          />
        </div>
        <div className="relative flex items-center justify-center">
          <HeartIcon
            className="stroke-tertiary size-5 cursor-pointer md:h-6 md:w-6"
            onClick={() => handleAuthNavigation('/wishlist')}
          />
          <CountBadge
            count={
              // wishlist?.products?.length > 9 ? '9+' : wishlist?.products?.length
              0
            }
          />
        </div>
        <Theme />
      </div>
    </>
  );
};
