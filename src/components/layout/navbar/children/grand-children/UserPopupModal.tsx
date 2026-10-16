import { Button, Divider } from '@beautinique/frontend-components';
import { usePathParams, useQueryParams } from '@beautinique/frontend-hooks';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';

import { USER_MENU_POPUP_DATA } from '@/constants/navbar.constants';
import { ROUTES } from '@/constants/routes.constants';
import useAuthNavigate from '@/hooks/useAuthNavigate';
import { useLogout } from '@/services/user-service/auth.service.query';
import useUserStore from '@/stores/user.store';

interface IUserPopupModal {
  isOpen: boolean;
  onClose: () => void;
}

// A popover under the navbar's user icon, not a dialog: it is drawn inside the icon's `relative`
// wrapper (no backdrop, no portal), so the navbar's outside-click handler on that wrapper sees a
// press on it as inside, and closes it only for a press elsewhere.
const UserPopupModal = ({ isOpen, onClose }: IUserPopupModal) => {
  const { navigate } = usePathParams();
  const authNavigate = useAuthNavigate();

  const { setParams, queryParams } = useQueryParams();
  const { user, authenticated } = useUserStore();
  const { mutateAsync: logout } = useLogout();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    authNavigate(path, isPrivateRoute);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || queryParams.login === 'true') return null;

  return (
    <div
      role="group"
      aria-label="Account menu"
      className="bg-tertiary-invert border-primary/20 absolute top-11 left-1/2 z-100 w-48 -translate-x-1/2 rounded-lg border p-4 shadow-lg"
    >
      <div className="w-full space-y-2">
        <div className="mx-auto flex flex-col items-center space-y-2">
          <div className="size-10">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="border-tertiary aspect-square size-full rounded-full border-2 object-cover"
              />
            ) : (
              <Icon icon="solar:user-circle-linear" className="text-tertiary size-full" />
            )}
          </div>
          <p className="line-clamp-1 text-sm font-semibold capitalize">
            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
          </p>
        </div>
        <Divider />
        <div className="space-y-2.5 py-1">
          {USER_MENU_POPUP_DATA.map((item, i) => (
            <button
              key={i}
              className="text-tertiary/80 hover:text-tertiary flex cursor-pointer items-center gap-2 text-sm/none"
              onClick={() => {
                handleNavigate(item.path, item.private);
              }}
            >
              <span className="size-5 shrink-0">
                <Icon icon={item.icon} className="size-full" />
              </span>
              {item.text}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 [&>button]:rounded-sm [&>button]:p-1.5 [&>button]:text-xs">
          <Button
            content={authenticated ? 'Logout' : 'Login'}
            pattern="primary"
            buttonProps={{
              onClick: () => {
                if (authenticated) {
                  void logout();
                } else {
                  setParams({ login: 'true' });
                }
                onClose();
              },
            }}
          />
          {!authenticated && (
            <Button
              content="Register"
              pattern="secondary"
              buttonProps={{
                onClick: () => {
                  void navigate(`/${ROUTES.AUTH.BASE}/${ROUTES.AUTH.REGISTER}`);
                  onClose();
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPopupModal;
