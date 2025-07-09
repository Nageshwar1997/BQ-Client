import DarkMode from "../../DarkMode";
import {
  BuildingIcon,
  HeartIcon,
  SearchIcon,
  ShoppingBag,
  UserCircleIcon,
} from "../../../icons";

const UserMenuIcons = ({ className }: { className?: string }) => {
  return (
    <div className={`flex gap-2 md:gap-3 xl:gap-5 ${className}`}>
      {/* Search Icon (Hidden on SM & XL screens) */}
      <span>
        <SearchIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
      </span>
      <span>
        <UserCircleIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
      </span>
      <span>
        <BuildingIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
      </span>
      <span>
        <ShoppingBag className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
      </span>
      <span>
        <HeartIcon className="stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
      </span>
      <span>
        <DarkMode />
      </span>
    </div>
  );
};

export default UserMenuIcons;
