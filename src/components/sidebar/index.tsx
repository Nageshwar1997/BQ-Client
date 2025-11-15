import { DropdownIcon, UserCircleIcon } from "../../icons";
import { SIDEBAR_DATA } from "../../constants";
import usePathParams from "../../hooks/usePathParams";
import { useUserStore } from "../../store/user.store";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../Gradients";

const Sidebar = () => {
  const { navigate } = usePathParams();
  const { user, logout } = useUserStore();
  const { showGradient, containerRef } = useVerticalScrollable();

  return (
    <div className="hidden base:block max-w-20 lg:max-w-[250px] w-full max-h-[calc(100dvh-64px)] lg:max-h-[calc(100dvh-100px)] grow bg-secondary-inverted text-tertiary sticky top-16 lg:top-[100px] border-r border-r-primary-30">
      <div className="w-full h-full flex flex-col gap-3">
        {/* Profile Section */}
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-1 px-2 py-3 border-b border-b-primary-30">
          <div className="w-8 h-8 lg:h-14 lg:w-14 overflow-hidden p-px bg-accent-duo rounded-full shadow-primary-btn">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                alt="Logo"
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
        <div className="w-full h-[calc(100%-100px)] relative">
          {showGradient.top && (
            <TopGradient className="!w-full h-8 -top-px from-secondary-inverted" />
          )}
          <div
            className="w-full h-full overflow-y-scroll p-2 flex flex-col gap-3 items-center"
            ref={containerRef}
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
                  className="w-fit lg:w-full flex items-center justify-between gap-2 group cursor-pointer p-2 border border-primary-10 rounded-lg hover:bg-primary-inverted-10 shadow-lg hover:shadow-primary-inverted-50 light:hover:shadow-primary-50 hover:scale-[1.02] duration-300"
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
        {showGradient.bottom && (
          <BottomGradient className="!w-full bottom-0 h-8 from-secondary-inverted" />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
