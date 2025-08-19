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
import useQueryParams from "../../../hooks/useQueryParams";
import { useUserStore } from "../../../store/user.store";
import useOutsideClick from "../../../hooks/useOutsideClick";

const UserPopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useUserStore();

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-[22px] md:mt-5 w-48"
      onMouseLeave={onClose}
    >
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        containerClassName="relative p-0 !rounded-lg"
        className="!bg-platinum-jet !rounded-lg [&>svg]:hidden"
      >
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
  const [isOpen, setIsOpen] = useState(false);
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const userPopupRef = useOutsideClick<HTMLDivElement>(() => {
    setOpenUserPopup(false);
  });
  const { paths } = useQueryParams();


  // Todo: Uncommit this useEffect before push
  // useEffect(() => {
  //   if (closeOnNavbarLeave) {
  //     setOpenUserPopup(false);
  //   }
  // }, [closeOnNavbarLeave]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SearchModal onClose={() => setIsOpen(false)} />
      </Modal>
      <div className={`flex gap-2 md:gap-3 xl:gap-5 ${className}`}>
        {!paths.includes("search") && (
          <SearchIcon
            onClick={() => setIsOpen(true)}
            className="stroke-tertiary w-5 h-5 md:w-6 md:h-6"
          />
        )}
        <div className="relative" ref={userPopupRef}>
          <UserCircleIcon
            onClick={() => setOpenUserPopup((prev) => !prev)}
            className={`w-5 h-5 md:w-6 md:h-6 cursor-pointer ${
              openUserPopup ? "!stroke-blue-crayola-c" : "stroke-tertiary"
            } hover:stroke-secondary`}
          />
          <UserPopup
            isOpen={openUserPopup}
            onClose={() => setOpenUserPopup(false)}
          />
        </div>
        <BuildingIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
        <ShoppingBag className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
        <HeartIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
        <DarkMode />
      </div>
    </>
  );
};

export default UserMenuIcons;
