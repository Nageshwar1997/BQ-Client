import { useEffect, useState } from "react";
import {
  BuildingIcon,
  HeartIcon,
  PercentCircleIcon,
  SearchIcon,
  ShoppingBag,
  TrackIcon,
  TruckIcon,
  UserCircleIcon,
} from "../../../icons";
import DarkMode from "../../DarkMode";
import Modal from "../../modal";
import SearchModal from "../../modal/children/SearchModal";
import usePathParams from "../../../hooks/usePathParams";
import { useUserStore } from "../../../store/user.store";
import useOutsideClick from "../../../hooks/useOutsideClick";
import Button from "../../button/Button";
import useQueryParams from "../../../hooks/useQueryParams";
import useCartStore from "../../../store/cart.store";
import useWishlistStore from "../../../store/wishlist.store";
import useRequireAuth from "../../../hooks/useRequireAuth";
import { Link } from "react-router-dom";

const UserPopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { navigate } = usePathParams();
  const { setParams } = useQueryParams();
  const { user, isAuthenticated, logout } = useUserStore();

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-[22px] md:mt-5 w-48"
      onMouseLeave={onClose}
    >
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        containerProps={{ className: "relative !p-0 !rounded-lg" }}
        className="!bg-platinum-jet !rounded-lg [&>div>div>svg]:hidden [&>div]:!p-4"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.firstName}
                  className="w-full h-full border-2 border-secondary rounded-full object-cover aspect-square"
                />
              ) : (
                <UserCircleIcon className="stroke-secondary w-full h-full" />
              )}
            </div>
            <p className="text-sm capitalize line-clamp-1 font-semibold">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </p>
          </div>
          <hr className="h-px block border-none bg-gradient-line" />
          <div className="flex flex-col gap-2.5 py-1">
            <Link
              to="/account"
              className="flex items-center gap-2 cursor-pointer"
            >
              <UserCircleIcon className="w-5 h-5 stroke-tertiary" />
              <p className="text-sm/none text-tertiary">My Profile</p>
            </Link>
            <Link
              to="/account/track"
              className="flex items-center gap-2 cursor-pointer"
            >
              <TrackIcon className="w-5 h-5 stroke-tertiary" />
              <p className="text-sm/none text-tertiary">Track Orders</p>
            </Link>
            <Link
              to="/account/orders"
              className="flex items-center gap-2 cursor-pointer"
            >
              <TruckIcon className="w-5 h-5 stroke-tertiary" />
              <p className="text-sm/none text-tertiary">Orders</p>
            </Link>
            <Link
              to="/account/cart"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 stroke-tertiary" />
              <p className="text-sm/none text-tertiary">Cart</p>
            </Link>
            <Link
              to="/offers"
              className="flex items-center gap-2 cursor-pointer"
            >
              <PercentCircleIcon className="w-5 h-5 stroke-tertiary" />
              <p className="text-sm/none text-tertiary">Offers</p>
            </Link>
          </div>
          <div className="flex justify-between items-center gap-2">
            <Button
              content={isAuthenticated ? "Logout" : "Login"}
              pattern="primary"
              className="!p-1.5 !rounded !text-xs"
              buttonProps={{
                onClick: () =>
                  !isAuthenticated ? setParams({ login: "true" }) : logout(),
              }}
            />
            {!isAuthenticated && (
              <Button
                content="Register"
                pattern="secondary"
                className="!p-1.5 !rounded !text-xs"
                buttonProps={{ onClick: () => navigate("/register") }}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const UserMenuIcons = ({
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
  const requireAuth = useRequireAuth();
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();

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
      <Modal
        key={"search-modal"}
        isOpen={isOpen.search}
        onClose={() => setIsOpen((prev) => ({ ...prev, search: false }))}
      >
        <SearchModal
          onClose={() => setIsOpen((prev) => ({ ...prev, search: false }))}
        />
      </Modal>
      <div className={`flex gap-2 md:gap-3 xl:gap-5 ${className}`}>
        {!paths.includes("search") && (
          <SearchIcon
            onClick={() => setIsOpen((prev) => ({ ...prev, search: true }))}
            className="cursor-pointer stroke-tertiary w-5 h-5 md:w-6 md:h-6"
          />
        )}
        <div className="relative" ref={userPopupRef}>
          <UserCircleIcon
            onClick={() => setIsOpen((prev) => ({ ...prev, user: true }))}
            className={`w-5 h-5 md:w-6 md:h-6 cursor-pointer ${
              isOpen.user ? "!stroke-blue-crayola-c" : "stroke-tertiary"
            } hover:stroke-secondary`}
          />
          <UserPopup
            isOpen={isOpen.user}
            onClose={() => setIsOpen((prev) => ({ ...prev, user: false }))}
          />
        </div>
        <BuildingIcon
          className="cursor-pointer stroke-tertiary w-5 h-5 md:w-6 md:h-6"
          onClick={() => navigate("/become-seller")}
        />
        <div className="relative">
          <ShoppingBag
            onClick={() => handleAuthNavigation("/cart")}
            className="cursor-pointer stroke-tertiary w-5 h-5 md:w-6 md:h-6"
          />
          {cart?.products && cart?.products.length > 0 && (
            <span className="absolute bottom-0.5 md:bottom-[3px] font-semibold bg-clip-text text-transparent bg-accent-duo inset-x-0 text-[11px] md:text-[11px] leading-none w-fit mx-auto pointer-events-none">
              {cart?.products.length}
            </span>
          )}
        </div>
        <div className="relative flex items-center justify-center">
          <HeartIcon
            className="cursor-pointer stroke-tertiary w-5 h-5 md:w-6 md:h-6"
            onClick={() => handleAuthNavigation("/wishlist")}
          />
          {wishlist?.products && wishlist?.products?.length > 0 && (
            <span className="absolute inset-0 flex items-center justify-center font-semibold bg-clip-text text-transparent bg-accent-duo inset-x-0 text-[11px] md:text-[11px] leading-none w-fit mx-auto pointer-events-none">
              {wishlist?.products?.length > 9
                ? "9+"
                : wishlist?.products?.length}
            </span>
          )}
        </div>
        <DarkMode />
      </div>
    </>
  );
};

export default UserMenuIcons;
