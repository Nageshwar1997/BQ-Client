import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { settingsItems } from '../../data';
import { Icon } from '@iconify/react';
import Button from '../../components/Button';
import { Fragment, useCallback, useState } from 'react';
import Userprofile from '../../components/Userprofile';
import type { ButtonProps } from '../../types';

export type HeaderActions = {
  saveBtnProps?: ButtonProps;
  cancelBtnProps?: ButtonProps;
};

type HeaderActionsState = {
  pathname: string;
  value: HeaderActions;
};

const stripButtonHandlers = (props?: ButtonProps): ButtonProps | undefined => {
  if (!props) return undefined;

  const { onClick, ...restProps } = props;
  void onClick;
  return restProps;
};

const areHeaderButtonPropsEqual = (prev?: ButtonProps, next?: ButtonProps) => {
  if (!prev && !next) return true;
  if (!prev || !next) return false;

  return (
    prev.content === next.content &&
    prev.variant === next.variant &&
    prev.size === next.size &&
    prev.className === next.className &&
    prev.disabled === next.disabled &&
    prev.isLoading === next.isLoading &&
    prev.type === next.type
  );
};

const areHeaderActionsEqual = (prev: HeaderActions, next: HeaderActions) =>
  areHeaderButtonPropsEqual(prev.saveBtnProps, next.saveBtnProps) &&
  areHeaderButtonPropsEqual(prev.cancelBtnProps, next.cancelBtnProps);

const isHeaderActionsEmpty = (actions: HeaderActions) =>
  !actions.saveBtnProps && !actions.cancelBtnProps;

const Settings = () => {
  const { pathname } = useLocation();
  const [actionsState, setActionsState] = useState<HeaderActionsState>({
    pathname,
    value: {},
  });
  const isPaymentsPage = pathname.includes('payments');
  const isGeneralPage = pathname.endsWith('general');

  const navigate = useNavigate();
  const setHeaderActions = useCallback(
    (nextActions: HeaderActions) => {
      setActionsState((prevState) => {
        const prevActionsForPath =
          prevState.pathname === pathname ? prevState.value : {};
        const nextActionsForPath = {
          saveBtnProps: nextActions.saveBtnProps,
          cancelBtnProps: nextActions.cancelBtnProps,
        };
        const nextVisualActions = {
          saveBtnProps: stripButtonHandlers(nextActionsForPath.saveBtnProps),
          cancelBtnProps: stripButtonHandlers(
            nextActionsForPath.cancelBtnProps
          ),
        };

        if (isHeaderActionsEmpty(nextActions)) {
          if (isHeaderActionsEmpty(prevActionsForPath)) {
            return prevState;
          }

          return {
            pathname,
            value: {},
          };
        }

        if (areHeaderActionsEqual(prevActionsForPath, nextVisualActions)) {
          return prevState;
        }

        return {
          pathname,
          value: nextActionsForPath,
        };
      });
    },
    [pathname]
  );

  const actions = actionsState.pathname === pathname ? actionsState.value : {};
  const visualActions = {
    saveBtnProps: stripButtonHandlers(actions.saveBtnProps),
    cancelBtnProps: stripButtonHandlers(actions.cancelBtnProps),
  };

  return (
    <div className="font-metropolis flex h-full w-full overflow-hidden">
      {/* sidebar */}
      <aside className="bg-neutral-gray-200 flex max-w-75 min-w-75 grow flex-col gap-8 overflow-hidden px-4 py-[22px]">
        <div className="flex flex-col gap-2">
          <img
            src="/assets/icons/Commverse Logo - Final.svg"
            alt="logo"
            className="h-auto w-full max-w-51 cursor-pointer object-cover"
            onClick={() => {
              navigate('/dashboard');
            }}
          />
        </div>
        <div className="flex grow flex-col gap-6 overflow-y-scroll">
          {settingsItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="text-neutral-gray-600 px-2 text-sm leading-6 font-medium">
                {item.title}
              </div>
              {item.children.map((child, childIndex) => {
                const isActive = pathname.includes(child.path);

                return (
                  <Link
                    key={childIndex}
                    to={child.path}
                    className={`flex items-center gap-2 rounded-lg px-2 py-[8.5px] ${isActive ? 'bg-white text-gray-900' : 'text-neutral-gray-700'} hover:bg-white hover:text-gray-900`}
                  >
                    <Icon icon={child.icon} className="h-4 w-4" />
                    {child.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
      <div className="flex h-full grow flex-col overflow-hidden">
        {/* header */}
        <header className="flex h-[88px] min-h-[88px] items-center justify-between border-b border-neutral-200 py-6 pr-12 pl-8">
          <div className="text-neutral-gray-900 text-2xl leading-7 font-bold">
            {isPaymentsPage ? 'Payments' : 'Settings'}
          </div>
          <div className="flex items-center gap-2">
            <Userprofile />
            {!isPaymentsPage && !isGeneralPage && (
              <Fragment>
                <Button
                  content="Cancel"
                  variant="secondary"
                  size="sm"
                  className="h-10! px-4! py-3!"
                  {...visualActions.cancelBtnProps}
                  onClick={actions.cancelBtnProps?.onClick}
                />
                <Button
                  content="Save"
                  size="sm"
                  className="h-10! px-4! py-3!"
                  {...visualActions.saveBtnProps}
                  onClick={actions.saveBtnProps?.onClick}
                />
              </Fragment>
            )}
          </div>
        </header>
        {/* content */}
        <div
          key={pathname.includes('/settings/brand-space/brand-kit') ? '/settings/brand-space/brand-kit' : pathname}
          className={`grow overflow-hidden overflow-y-scroll p-12 pt-6 ${pathname.includes('/settings/brand-space/brand-kit/typography') ? 'pb-0.5' : 'p-12'} pl-8`}
        >
          <Outlet context={{ setHeaderActions }} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
