import { DropdownIcon, UserCircleIcon } from "../../icons";
import { SIDEBAR_DATA } from "../../constants";
import usePathParams from "../../hooks/usePathParams";
import { useUserStore } from "../../store/user.store";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import {
  BottomGradient,
  LeftGradient,
  RightGradient,
  TopGradient,
} from "../Gradients";
import useHorizontalScrollable from "../../hooks/useHorizontalScrollable";
import useIsMobile from "../../hooks/useIsMobile";
import { useLogout } from "../../api/auth/auth.service";

const Sidebar = () => {
  const { navigate } = usePathParams();
  const { user } = useUserStore();
  const { logout } = useLogout();
  const { showGradient: showV_Gradient, containerRef: vContainerRef } =
    useVerticalScrollable();
  const { showGradient: showH_Gradient, containerRef: hContainerRef } =
    useHorizontalScrollable();
  const isMobile = useIsMobile(640);

  return (
    <div className="w-full sm:max-w-20 lg:max-w-62.5 sm:max-h-[calc(100dvh-64px)] lg:max-h-[calc(100dvh-100px)] grow bg-tertiary-inverted sm:bg-secondary-inverted text-tertiary fixed sm:sticky bottom-0 sm:bottom-auto sm:top-16 lg:top-25 sm:border-r border-r-primary-30 z-50 sm:z-0">
      <div className="w-full h-full flex sm:flex-col sm:gap-3">
        {/* Profile Section */}
        <div className="w-full hidden sm:flex flex-col lg:flex-row justify-center items-center gap-1 px-2 py-3 sm:border-b border-b-primary-30">
          <div className="w-8 h-8 lg:h-14 lg:w-14 overflow-hidden p-px bg-accent-duo rounded-full shadow-primary-btn">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="object-cover w-full h-full rounded-full"
                draggable={false}
              />
            ) : (
              <UserCircleIcon className="stroke-secondary w-full h-full" />
            )}
          </div>
          <div className="text-center grow">
            <p className="text-xs lg:text-xl font-medium lg:font-bold text-transparent bg-accent-duo bg-clip-text line-clamp-1">
              {user?.firstName}
            </p>
            <p className="text-xs lg:text-xl font-medium lg:font-bold text-transparent bg-accent-duo bg-clip-text line-clamp-1">
              {user?.lastName}
            </p>
          </div>
        </div>
        <div className="w-full sm:h-[calc(100%-100px)] relative">
          {showV_Gradient.top && (
            <TopGradient className="w-full! h-8 -top-px from-secondary-inverted hidden sm:block" />
          )}
          {showH_Gradient.left && (
            <LeftGradient className="w-8! h-full left-0 from-secondary-inverted sm:hidden" />
          )}
          <div
            className={`w-full h-full overflow-x-scroll sm:overflow-y-scroll scroll-smooth p-2 flex sm:flex-col gap-3 items-center ${
              !showH_Gradient.right && !showH_Gradient.left
                ? "justify-evenly sm:justify-start"
                : ""
            }`}
            ref={isMobile ? hContainerRef : vContainerRef}
          >
            {SIDEBAR_DATA.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() =>
                    item.path
                      ? navigate(item.path)
                      : item.label === "Logout"
                      ? logout()
                      : null
                  }
                  className="w-fit lg:w-full flex items-center justify-between gap-2 group cursor-pointer p-2 border border-primary-10 rounded-lg hover:bg-primary-inverted-10 shadow-lg hover:shadow-primary-inverted-50 hover:light:shadow-primary-50 hover:scale-[1.02] duration-300"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${item.className}`}
                    />
                    <p className="text-tertiary group-hover:text-primary text-base hidden lg:block">
                      {item.label}
                    </p>
                  </div>
                  <DropdownIcon
                    className={`-rotate-90 stroke-tertiary group-hover:stroke-primary hidden ${
                      item.label !== "Logout" ? "lg:block" : ""
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {showV_Gradient.bottom && (
          <BottomGradient className="w-full! bottom-0 h-8 from-secondary-inverted hidden sm:block" />
        )}
        {showH_Gradient.right && (
          <RightGradient className="w-8! h-full right-0 from-secondary-inverted sm:hidden" />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
