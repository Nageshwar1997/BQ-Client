import { Service } from '../../../api-service';
import { SIDEBAR_DATA } from '../../../constants';
import { Hook } from '../../../hooks';
import { ChevronDownIcon, UserCircleIcon } from '../../../icons';
import { store } from '../../../store';
import { GradientText, LinearGradient } from '../../ui';

export const Sidebar = () => {
  const { navigate } = Hook.PathParams();
  const { user } = store.user();
  const { mutateAsync: logout } = Service.Auth.Logout();
  const { showV_Gradient, containerRef: vContainerRef } = Hook.Scrollable('vertical');
  const { showH_Gradient, containerRef: hContainerRef } = Hook.Scrollable('horizontal');
  const isMobile = Hook.IsMobile(640);

  return (
    <div className="bg-tertiary-invert sm:bg-secondary-invert text-tertiary border-r-primary/30 fixed bottom-0 z-50 w-full grow sm:sticky sm:top-16 sm:bottom-auto sm:z-0 sm:max-h-[calc(100dvh-64px)] sm:max-w-20 sm:border-r lg:top-25 lg:max-h-[calc(100dvh-100px)] lg:max-w-62.5">
      <div className="flex h-full w-full sm:flex-col sm:gap-3">
        {/* Profile Section */}
        <div className="border-b-primary/30 hidden w-full flex-col items-center justify-center gap-1 px-2 py-3 sm:flex sm:border-b lg:flex-row">
          <div className="bg-accent-duo shadow-primary-btn size-8 overflow-hidden rounded-full p-px lg:size-14">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="size-full rounded-full object-cover"
                draggable={false}
              />
            ) : (
              <UserCircleIcon className="stroke-secondary size-full" />
            )}
          </div>

          <div className="grow text-center">
            {[user?.firstName, user?.lastName].map((text, index) => (
              <GradientText
                key={index}
                text={text!}
                type="accent"
                className="line-clamp-1 text-xs font-medium lg:text-xl lg:font-bold"
              />
            ))}
          </div>
        </div>
        <div className="relative w-full sm:h-[calc(100%-100px)]">
          {showV_Gradient.top && (
            <LinearGradient position="top" className="from-secondary-invert hidden h-8 sm:block" />
          )}
          {showH_Gradient.left && (
            <LinearGradient position="left" className="from-secondary-invert w-8! sm:hidden" />
          )}
          <div
            className={`flex h-full w-full items-center gap-3 overflow-x-scroll scroll-smooth p-2 sm:flex-col sm:overflow-y-scroll ${
              !showH_Gradient.right && !showH_Gradient.left ? 'justify-evenly sm:justify-start' : ''
            }`}
            ref={isMobile ? hContainerRef : vContainerRef}
          >
            {SIDEBAR_DATA.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() =>
                    item.path ? navigate(item.path) : item.label === 'Logout' ? logout() : null
                  }
                  className="group border-primary/10 hover:bg-primary-invert/10 hover:shadow-primary-invert/50 hover:light:shadow-primary/50 flex w-fit cursor-pointer items-center justify-between gap-2 rounded-lg border p-2 shadow-lg duration-300 hover:scale-[1.02] lg:w-full"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`size-5 transition-colors duration-300 ${item.className}`} />
                    <p className="text-tertiary group-hover:text-primary hidden text-base lg:block">
                      {item.label}
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={`stroke-tertiary group-hover:stroke-primary hidden -rotate-90 ${
                      item.label !== 'Logout' ? 'lg:block' : ''
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {showV_Gradient.bottom && (
          <LinearGradient position="bottom" className="from-secondary-invert hidden h-8 sm:block" />
        )}
        {showH_Gradient.right && (
          <LinearGradient position="right" className="from-secondary-invert w-8! sm:hidden" />
        )}
      </div>
    </div>
  );
};
