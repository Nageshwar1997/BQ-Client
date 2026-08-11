import { Icon } from '@iconify/react';
import { type Ref, useImperativeHandle, useState } from 'react';
import { Link } from 'react-router-dom';

import GradientText from '@/components/ui/GradientText';
import Theme from '@/components/ui/Theme';
import { ROUTES } from '@/constants/routes.constants';
import useAuthNavigate from '@/hooks/useAuthNavigate';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import usePathParams from '@/hooks/usePathParams';
import type { TCategoryHierarchyNode, TLevel2, TLevel3 } from '@/types/api.type';
import type { IChildren, IClassName } from '@/types/component.type';
import { getTodaysFeedback, resolveCategoryPath } from '@/utils/common.util';

import UserPopupModal from './UserPopupModal';

// Shared bordered wrapper used for each labeled block inside a hover-panel column
// (L2Category's per-category groups, and the static blocks in About/ForYou).
export const CategorySection = ({ children, className = '' }: IChildren & IClassName) => (
  <div className={`border-b-battleship-davys-gray border-b pb-1 ${className}`}>{children}</div>
);

export const CategoryLabel = ({
  name,
  path,
  className = '',
}: { name: string; path?: string } & IClassName) => {
  const target = path ? resolveCategoryPath(path) : undefined;

  return (
    <p
      className={`text-battleship-davys-gray-invert break-inside-avoid text-left text-sm leading-5 font-semibold tracking-wide uppercase ${className}`}
    >
      {target ? <Link to={target}>{name}</Link> : name}
    </p>
  );
};

export const Feedback = () => {
  const FEEDBACK = getTodaysFeedback();
  return (
    <div className="border-primary/50 flex w-full flex-col gap-2 border-b pt-4 lg:flex-row lg:items-center lg:border-t lg:border-b-transparent">
      <div className="flex w-fit items-center gap-2">
        <Icon icon="solar:chat-dots-linear" className="text-secondary size-4 2xl:size-5" />
        <p className="text-secondary text-sm font-medium text-nowrap lg:text-[11px] xl:text-sm">
          {`User's Feedback:`}
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

export const L3Category = ({
  category,
  l1Slug,
  l2Slug,
  className = '',
}: IClassName & {
  category: TCategoryHierarchyNode<TLevel3>;
  l1Slug?: string;
  l2Slug?: string;
}) => {
  const target = resolveCategoryPath(category.path, l1Slug, l2Slug, category.slug);
  const content = (
    <>
      <p className="text-secondary group-hover:text-primary line-clamp-1 text-left text-xs tracking-wide transition-colors xl:text-sm">
        {category.name}
      </p>
      <p className="text-silver-jet group-hover:text-tertiary line-clamp-2 text-[8px] leading-3 wrap-break-word transition-colors xl:text-[10px]">
        {category.description}
      </p>
    </>
  );

  const sharedClassName = `hover:bg-smoke-eerie hover:border-primary/8 group break-inside-avoid rounded-xl border border-transparent p-2 transition-colors ${className}`;

  return target ? (
    <Link to={target} className={sharedClassName}>
      {content}
    </Link>
  ) : (
    <div className={sharedClassName}>{content}</div>
  );
};

export const L2Category = ({
  categories,
  l1Slug,
  children,
  className = '',
}: { categories: TCategoryHierarchyNode<TLevel2>[]; l1Slug?: string } & IClassName &
  Partial<IChildren>) => {
  return (
    <div
      className={`base:columns-2 columns-1 gap-3 md:columns-3 md:gap-4 lg:columns-4 lg:gap-5 ${className}`}
    >
      {categories.map((category, index) => (
        <CategorySection key={index} className="mb-3 break-inside-auto md:mb-4 md:pb-2 lg:mb-5">
          <CategoryLabel
            name={category.name}
            path={resolveCategoryPath(category.path, l1Slug, category.slug)}
            className="px-2"
          />
          <div className="flex flex-col gap-1 md:gap-2">
            {category.subcategories.map((subcategory, index) => (
              <L3Category
                key={index}
                category={subcategory}
                l1Slug={l1Slug}
                l2Slug={category.slug}
              />
            ))}
          </div>
        </CategorySection>
      ))}
      {children}
    </div>
  );
};

const CountBadge = ({ count }: { count?: number | string }) => {
  if (!count) return null;

  return (
    <GradientText
      text={String(count)}
      type="accent"
      className="pointer-events-none absolute inset-x-0 bottom-0.5 mx-auto w-fit text-[11px] leading-none font-semibold md:bottom-0.75"
    />
  );
};

export interface IUserMenuIconsHandle {
  close: () => void;
}

export const UserMenuIcons = ({
  className = '',
  ref,
}: IClassName & { ref?: Ref<IUserMenuIconsHandle> }) => {
  const [isOpen, setIsOpen] = useState({
    search: false,
    user: false,
  });
  const userPopupRef = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen((prev) => ({ ...prev, user: false }));
  });
  const { paths } = usePathParams();
  const authNavigate = useAuthNavigate();
  //   const { cart } = useCartStore();
  //   const { wishlist } = useWishlistStore();

  const handleAuthNavigation = (path: string) => {
    authNavigate(path, true);
  };

  useImperativeHandle(
    ref,
    () => ({
      close: () => {
        setIsOpen({ search: false, user: false });
      },
    }),
    [],
  );

  return (
    <>
      {/* <SearchModal
        isOpen={isOpen.search}
        onClose={() => setIsOpen((prev) => ({ ...prev, search: false }))}
      /> */}
      <div className={`flex items-center gap-2 md:gap-3 xl:gap-5 ${className}`}>
        <Theme />
        {!paths.includes('search') && (
          <Icon
            icon="solar:magnifer-linear"
            onClick={() => {
              setIsOpen((prev) => ({ ...prev, search: true }));
            }}
            className="text-tertiary hover:text-secondary size-5 cursor-pointer md:size-6"
          />
        )}

        <div className="relative" ref={userPopupRef}>
          <Icon
            icon="solar:user-circle-linear"
            onClick={() => {
              setIsOpen((prev) => ({ ...prev, user: true }));
            }}
            className={`size-5 cursor-pointer md:size-6 ${isOpen.user ? 'text-blue-crayola-c' : 'text-tertiary hover:text-secondary'}`}
          />
          <UserPopupModal
            isOpen={isOpen.user}
            onClose={() => {
              setIsOpen((prev) => ({ ...prev, user: false }));
            }}
          />
        </div>
        <Icon
          icon="solar:shop-2-linear"
          onClick={() => {
            handleAuthNavigation(`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.BECOME_SELLER}`);
          }}
          className="text-tertiary hover:text-secondary size-5 cursor-pointer md:size-6"
        />
        <div className="relative">
          <Icon
            icon="solar:bag-5-linear"
            onClick={() => {
              handleAuthNavigation(`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.CART}`);
            }}
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
            onClick={() => {
              handleAuthNavigation(`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.WISHLIST}`);
            }}
            className="text-tertiary hover:text-secondary size-5 cursor-pointer md:size-6"
          />
          <CountBadge
            count={
              // wishlist?.products?.length > 9 ? '9+' : wishlist?.products?.length
              0
            }
          />
        </div>
      </div>
    </>
  );
};
