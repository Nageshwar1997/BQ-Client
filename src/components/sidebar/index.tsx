import { DropdownIcon, SettingIcon, UserCircleIcon } from "../../icons";
import { SIDEBAR_DATA } from "../../constants";
import usePathParams from "../../hooks/usePathParams";
import { useUserStore } from "../../store/user.store";

const Sidebar = () => {
  const { navigate } = usePathParams();
  const { user } = useUserStore();

  return (
    <div className="max-w-20 lg:max-w-[250px] w-full max-h-[calc(100dvh-64px)] lg:max-h-[calc(100dvh-100px)] grow bg-secondary-inverted text-tertiary sticky top-16 lg:top-[100px]">
      <div className="w-full h-full flex flex-col gap-3">
        {/* Profile Section */}
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-1 px-2 py-3">
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
        <div className="w-full grow">
          <div className="w-full relative flex flex-col justify-between items-center h-full">
            <div className="w-full h-full overflow-y-scroll p-2 flex flex-col gap-3 pb-10 items-center">
              {SIDEBAR_DATA.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    onClick={() => navigate(`${item.path}`)}
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
                    <DropdownIcon className="-rotate-90 stroke-tertiary group-hover:stroke-primary hidden lg:block" />
                  </div>
                );
              })}
            </div>
            <div className="px-2 w-fit lg:w-full">
              <div className="w-full flex items-center justify-between gap-2 group cursor-pointer p-2 border border-primary-10 rounded-lg hover:bg-primary-inverted-10 shadow-lg hover:shadow-primary-inverted-50 light:hover:shadow-primary-50 hover:scale-[1.02] duration-300 mb-4">
                <div className="flex items-center gap-2">
                  <SettingIcon className="w-5 h-5 stroke-tertiary group-hover:stroke-primary transition-colors duration-300" />
                  <p className="text-tertiary group-hover:text-primary text-base hidden lg:block">
                    Settings
                  </p>
                </div>
                <DropdownIcon className="-rotate-90 stroke-tertiary group-hover:stroke-primary hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
