import { useEffect, useState } from 'react';
import { customHooks } from '../../../../../hooks';
import { ModalWrapper } from '../../../modals';
import {
  BuildingIcon,
  HeartIcon,
  SearchIcon,
  ShoppingBag,
  UserCircleIcon,
} from '../../../../../icons';
import { UserPopupModal } from '../../../modals/UserPopupModal';
import { GradientText, Theme } from '../../../../ui';

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
  const userPopupRef = customHooks.OutsideClick<HTMLDivElement>(() => {
    setIsOpen((prev) => ({ ...prev, user: false }));
  });
  const { paths, navigate } = customHooks.PathParams();
  const requireAuth = customHooks.RequireAuth();
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
      <ModalWrapper
        key={'search-modal'}
        isOpen={isOpen.search}
        onClose={() => setIsOpen((prev) => ({ ...prev, search: false }))}
      >
        <div className=""></div>
        {/* <SearchModal onClose={() => setIsOpen((prev) => ({ ...prev, search: false }))} /> */}
      </ModalWrapper>
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
          {/* <CountBadge count={cart?.products?.length} /> */}
        </div>
        <div className="relative flex items-center justify-center">
          <HeartIcon
            className="stroke-tertiary size-5 cursor-pointer md:h-6 md:w-6"
            onClick={() => handleAuthNavigation('/wishlist')}
          />
          {/* <CountBadge count={wishlist?.products?.length > 9 ? '9+' : wishlist?.products?.length} /> */}
        </div>
        <Theme />
      </div>
    </>
  );
};
