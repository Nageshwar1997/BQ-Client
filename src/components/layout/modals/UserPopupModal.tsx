import { Service } from '@/Api-Service';
import { HR, Button } from '@/Components/UI';
import { USER_MENU_POPUP_DATA } from '@/Constants';
import { Hook } from '@/Hooks';
import { UserCircleIcon } from '@/Icons';
import { Store } from '@/Store';
import { ModalWrapper } from './ModalWrapper';

export const UserPopupModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { navigate } = Hook.PathParams();
  const requireAuth = Hook.RequireAuth();

  const { setParams, queryParams } = Hook.QueryParams();
  const { user, authenticated } = Store.User();
  const { mutateAsync } = Service.Auth.Logout();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    const action = () => navigate(path); // wrap in a function
    if (isPrivateRoute && !requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
    onClose();
  };

  if (!isOpen || queryParams.login === 'true') return null;

  return (
    <div
      className="absolute top-full left-1/2 mt-5.5 w-48 -translate-x-1/2 transform md:mt-5"
      onMouseLeave={onClose}
    >
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        containerProps={{ className: 'relative p-0! rounded-lg!' }}
        className="bg-platinum-jet! rounded-lg! [&>div]:p-4! [&>div>svg]:hidden"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="size-10">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.firstName}
                  className="border-tertiary aspect-square h-full w-full rounded-full border-2 object-cover"
                />
              ) : (
                <UserCircleIcon className="stroke-tertiary size-full" />
              )}
            </div>
            <p className="line-clamp-1 text-sm font-semibold capitalize">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
            </p>
          </div>
          <HR />
          <div className="flex flex-col gap-2.5 py-1">
            {USER_MENU_POPUP_DATA.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  className="[&>svg]:stroke-tertiary text-tertiary flex cursor-pointer items-center gap-2 text-sm/none opacity-80 transition-all duration-300 hover:scale-x-105 hover:opacity-100 [&>svg]:size-5"
                  onClick={() => handleNavigate(item.path, item.private)}
                >
                  <Icon />
                  {item.text}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2 [&>button]:rounded-sm [&>button]:p-1.5 [&>button]:text-xs">
            <Button
              content={authenticated ? 'Logout' : 'Login'}
              pattern="primary"
              buttonProps={{
                onClick: () => (authenticated ? mutateAsync() : setParams({ login: 'true' })),
              }}
            />
            {!authenticated && (
              <Button
                content="Register"
                pattern="secondary"
                buttonProps={{ onClick: () => navigate('/register') }}
              />
            )}
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};
