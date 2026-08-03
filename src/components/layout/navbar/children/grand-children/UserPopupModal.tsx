import { Icon } from '@iconify/react';

import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import { USER_MENU_POPUP_DATA } from '@/constants/navbar.constants';
import { ROUTES } from '@/constants/routes.constants';
import useAuthNavigate from '@/hooks/useAuthNavigate';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useLogout } from '@/services/user-service/auth.service.query';
import useUserStore from '@/stores/user.store';
import type { IModalWrapper } from '@/types/component.type';

const UserPopupModal = ({ isOpen, onClose }: Pick<IModalWrapper, 'isOpen' | 'onClose'>) => {
  const { navigate } = usePathParams();
  const authNavigate = useAuthNavigate();

  const { setParams, queryParams } = useQueryParams();
  const { user, authenticated } = useUserStore();
  const { mutateAsync: logout } = useLogout();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    authNavigate(path, isPrivateRoute);
    onClose();
  };

  if (!isOpen || queryParams.login === 'true') return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      containerProps={{
        className:
          'absolute! inset-auto top-11 left-1/2 w-48 -translate-x-1/2 transform p-0! rounded-lg',
      }}
      className="bg-tertiary-invert rounded-lg!"
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
    </ModalWrapper>
  );
};

export default UserPopupModal;
