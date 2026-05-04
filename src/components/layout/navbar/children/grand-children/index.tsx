import GradientText from '@/components/ui/GradientText';
import Theme from '@/components/ui/Theme';
import { NAVBAR_CATEGORIES_DATA, type HIGHLIGHTED_CATEGORIES } from '@/constants/navbar.constants';
import useAuthAction from '@/hooks/useAuthAction';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import usePathParams from '@/hooks/usePathParams';
import type { TClassName, TForwardIdx } from '@/types/component.type';

import { getTodaysFeedback, isHighlightedCategory } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const CategoryLabel = ({
  label,
  path = '',
  className = '',
}: { label: string; path?: string } & TClassName) => (
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
        <Icon icon="solar:chat-dots-linear" className="text-secondary size-4 2xl:size-5" />
        <p className="text-secondary text-sm font-medium text-nowrap lg:text-[11px] xl:text-sm">
          User's Feedback:
        </p>
      </div>
      {FEEDBACK.map((item) => (
        <GradientText
          key={item.text}
          text={item.text}
          type={item.type}
          className="text-[11px] xl:text-sm"
        />
      ))}
    </div>
  );
};

export const HoveredComponent = ({ index }: { index: number | null }) => {
  if (index === null || index >= NAVBAR_CATEGORIES_DATA.length) {
    return null;
  }

  const Component = NAVBAR_CATEGORIES_DATA[index].component;

  return (
    <div className="bg-battleship-davys-gray h-full max-w-325 rounded-xl p-px backdrop-blur-3xl">
      <div className="text-secondary bg-secondary-invert rounded-xl p-5">
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
  subCategories: readonly (typeof NAVBAR_CATEGORIES_DATA)[number]['subCategories'][number]['subCategories'][number][];
  l1Cat?: keyof typeof HIGHLIGHTED_CATEGORIES;
}) => {
  const { navigate } = usePathParams();
  return (
    <div className={`flex flex-col gap-1 md:gap-2 ${className}`}>
      {subCategories.map((subCategory, index) => {
        const isHighlighted = isHighlightedCategory(subCategory.category, l1Cat);
        return (
          <div
            onClick={() => subCategory?.path && navigate(subCategory.path)}
            key={index}
            className={`hover:bg-smoke-eerie flex cursor-pointer justify-start gap-2 rounded-xl border border-transparent p-2 ${
              isHighlighted ? 'hover:border-blue-crayola-c' : 'hover:border-primary/8'
            } group`}
          >
            {subCategory.icon && (
              <div
                className={`bg-secondary-invert group-hover:bg-primary-invert flex size-10 shrink-0 items-center justify-center rounded-lg xl:size-12 ${
                  isHighlighted
                    ? 'bg-accent-duo group-hover:shadow-primary-btn-hover [&>svg]:text-white'
                    : 'shadow-battleship-davys-gray shadow-inner'
                }`}
              >
                <Icon icon={subCategory.icon} className="text-secondary" />
              </div>
            )}
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
  const userPopupRef = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen((prev) => ({ ...prev, user: false }));
  });
  const { paths, navigate } = usePathParams();
  const { runAction } = useAuthAction();
  //   const { cart } = useCartStore();
  //   const { wishlist } = useWishlistStore();

  const handleAuthNavigation = (path: string) => {
    const action = () => navigate(path); // wrap in a function
    runAction(action);
  };

  useEffect(() => {
    if (closeOnNavbarLeave) {
      setIsOpen({ search: false, user: false });
    }
  }, [closeOnNavbarLeave]);

  return (
    <>
      {/* <SearchModal
        isOpen={isOpen.search}
        onClose={() => setIsOpen((prev) => ({ ...prev, search: false }))}
      /> */}
      <div className={`flex items-center gap-2 md:gap-3 xl:gap-5 ${className}`}>
        {!paths.includes('search') && (
          <Icon
            icon="solar:magnifer-linear"
            onClick={() => setIsOpen((prev) => ({ ...prev, search: true }))}
            className="text-tertiary hover:text-secondary size-5 cursor-pointer md:size-6"
          />
        )}
        <div className="relative" ref={userPopupRef}>
          <Icon
            icon="solar:user-circle-linear"
            onClick={() => setIsOpen((prev) => ({ ...prev, user: true }))}
            className={`size-5 cursor-pointer md:size-6 ${isOpen.user ? 'text-blue-crayola-c' : 'text-tertiary hover:text-secondary'}`}
          />
          {/* <UserPopupModal
            isOpen={isOpen.user}
            onClose={() => setIsOpen((prev) => ({ ...prev, user: false }))}
          /> */}
        </div>
        <Icon
          icon="solar:shop-2-linear"
          onClick={() => handleAuthNavigation('/become-seller')}
          className="text-tertiary hover:text-secondary size-5 cursor-pointer md:size-6"
        />
        <div className="relative">
          <Icon
            icon="solar:bag-5-linear"
            onClick={() => handleAuthNavigation('/cart')}
            className="text-tertiary hover:text-secondary size-5 cursor-pointer md:size-6"
          />
          <CountBadge
            count={
              // cart?.products?.length
              0
            }
          />
        </div>
        <div className="relative flex items-center justify-center">
          <Icon
            icon="solar:heart-outline"
            onClick={() => handleAuthNavigation('/wishlist')}
            className="text-tertiary hover:text-secondary size-5 cursor-pointer md:size-6"
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
