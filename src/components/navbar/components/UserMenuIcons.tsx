import DarkMode from "../../DarkMode";
import {
  BuildingIcon,
  HeartIcon,
  SearchIcon,
  ShoppingBag,
  UserCircleIcon,
} from "../../../icons";
import { useState } from "react";
import Modal from "../../modal";
import SearchModal from "../../modal/childrens/SearchModal";

const UserMenuIcons = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Modal
        children={<SearchModal />}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className={`flex gap-2 md:gap-3 xl:gap-5 ${className}`}>
        <SearchIcon
          onClick={() => setIsOpen(true)}
          className="stroke-tertiary w-5 h-5 md:w-6 md:h-6"
        />
        <UserCircleIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
        <BuildingIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
        <ShoppingBag className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
        <HeartIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
        <DarkMode />
      </div>
    </>
  );
};

export default UserMenuIcons;
