import { useEffect, useState } from "react";
import {
  BuildingIcon,
  HeartIcon,
  SearchIcon,
  ShoppingBag,
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
import { useLogout } from "../../../api/auth/auth.service";
import { USER_MENU_POPUP_DATA } from "../data";

const UserPopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { navigate } = usePathParams();
  const requireAuth = useRequireAuth();

  const { setParams, queryParams } = useQueryParams();
  const { user, isAuthenticated } = useUserStore();
  const { logout } = useLogout();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    const action = () => navigate(path); // wrap in a function
    if (isPrivateRoute && !requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
    onClose();
  };

  if (!isOpen || queryParams.login === "true") return null;

  return (
    <div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-5.5 md:mt-5 w-48"
      onMouseLeave={onClose}
    >
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        containerProps={{ className: "relative p-0! rounded-lg!" }}
        className="bg-platinum-jet! rounded-lg! [&>div>div>svg]:hidden [&>div]:p-4!"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.firstName}
                  className="w-full h-full border-2 border-tertiary rounded-full object-cover aspect-square"
                />
              ) : (
                <UserCircleIcon className="stroke-tertiary w-full h-full" />
              )}
            </div>
            <p className="text-sm capitalize line-clamp-1 font-semibold">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </p>
          </div>
          <hr className="h-px block border-none bg-gradient-line" />
          <div className="flex flex-col gap-2.5 py-1">
            {USER_MENU_POPUP_DATA.map((item, i) => (
              <button
                key={i}
                className="flex items-center gap-2 cursor-pointer [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-tertiary text-tertiary text-sm/none hover:scale-x-105 opacity-80 hover:opacity-100 transition-all duration-300"
                onClick={() => handleNavigate(item.path, item.private)}
              >
                {item.icon}
                {item.text}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center gap-2 [&>button]:p-1.5 [&>button]:rounded-sm [&>button]:text-xs">
            <Button
              content={isAuthenticated ? "Logout" : "Login"}
              pattern="primary"
              buttonProps={{
                onClick: () =>
                  isAuthenticated ? logout() : setParams({ login: "true" }),
              }}
            />
            {!isAuthenticated && (
              <Button
                content="Register"
                pattern="secondary"
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
              isOpen.user
                ? "stroke-blue-crayola-c"
                : "stroke-tertiary hover:stroke-secondary"
            }`}
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
            <span className="absolute bottom-0.5 md:bottom-0.75 font-semibold bg-clip-text text-transparent bg-accent-duo inset-x-0 text-[11px] md:text-[11px] leading-none w-fit mx-auto pointer-events-none">
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
