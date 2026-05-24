import GradientText from '@/components/ui/GradientText';
import Theme from '@/components/ui/Theme';
import { NAVBAR_CATEGORIES_DATA } from '@/constants/navbar.constants';
import useAuthAction from '@/hooks/useAuthAction';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import usePathParams from '@/hooks/usePathParams';
import type { TClassName } from '@/types/component.type';

import { getTodaysFeedback } from '@/utils/common.util';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const CategoryLabel = ({
  name,
  path,
  className,
}: { name: string; path?: string } & TClassName) => (
  <p
    className={`text-battleship-davys-gray-invert break-inside-avoid text-left text-sm leading-5 font-semibold tracking-wide uppercase ${
      path ? 'cursor-pointer' : 'cursor-default'
    } ${className || ''}`}
  >
    {path ? <Link to={path}>{name}</Link> : name}
  </p>
);

export const Feedback = () => {
  const FEEDBACK = getTodaysFeedback();
  return (
    <div className="border-primary/50 flex w-full flex-col gap-2 border-b pt-4 lg:flex-row lg:items-center lg:border-t lg:border-b-transparent">
      <div className="flex w-fit items-center gap-2">
        <Icon icon="solar:chat-dots-linear" className="text-secondary size-4 2xl:size-5" />
        <p className="text-secondary text-sm font-medium text-nowrap lg:text-[11px] xl:text-sm">
          User's Feedback:
        </p>
      </div>
      <div className="flex flex-wrap gap-1 *:text-[11px] *:xl:text-sm">
        {FEEDBACK.map((item, idx) => (
          <GradientText key={idx} {...item} className="wrap-break-word" />
        ))}
      </div>
    </div>
  );
};

export const SubCategory = ({
  subCategory,
  className,
}: TClassName & {
  subCategory: (typeof NAVBAR_CATEGORIES_DATA)[number]['subCategories'][number]['subCategories'][number];
}) => {
  const { navigate } = usePathParams();

  return (
    <div
      onClick={() => subCategory?.path && navigate(subCategory.path)}
      className={`hover:bg-smoke-eerie hover:border-primary/8 group cursor-pointer break-inside-avoid rounded-xl border border-transparent p-2 transition-colors ${className || ''}`}
    >
      <p className="text-secondary group-hover:text-primary line-clamp-1 text-left text-xs tracking-wide transition-colors xl:text-sm">
        {subCategory.name}
      </p>
      <p className="text-silver-jet group-hover:text-tertiary line-clamp-2 text-[8px] leading-3 wrap-break-word transition-colors xl:text-[10px]">
        {subCategory.description}
      </p>
    </div>
  );
};

export const SubCategories = ({
  subCategories,
  className = '',
}: TClassName & {
  subCategories: readonly (typeof NAVBAR_CATEGORIES_DATA)[number]['subCategories'][number]['subCategories'][number][];
}) => (
  <div className={`flex flex-col gap-1 md:gap-2 ${className}`}>
    {subCategories.map((subCategory, index) => (
      <SubCategory key={index} subCategory={subCategory} />
    ))}
  </div>
);

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
