import { useCallback, useEffect, useMemo, useState } from 'react';
import ToastCard from '../../../../../components/AlertCards/ToastCard';
import { useRegisterSettingsHeaderActions } from '../../../../../hooks/useRegisterSettingsHeaderActions';
import {
  useGetUserDetail,
  useUpdateProfile,
} from '../../../../../services/auth-service';
import type { ToastCardProps } from '../../../../../types';

type ThemeOption = 'light' | 'dark' | 'auto';

const LightMode = ({ className = '' }: { className?: string }) => (
  <div
    className={`border-neutral-gray-400 bg-neutral-gray-100 flex w-[120px] flex-col gap-1.5 rounded-sm border-[0.5px] p-2.5 ${className}`}
  >
    <div className="flex gap-1">
      <div className="bg-neutral-gray-300 h-[11px] w-[11px] rounded-full"></div>
      <div className="bg-neutral-gray-300 grow rounded-xs"></div>
    </div>
    <div className="flex gap-1">
      <div className="bg-neutral-gray-300 h-[11px] w-[11px] rounded-full"></div>
      <div className="bg-utility-indigo-200 max-w-3/5 grow rounded-xs"></div>
    </div>
  </div>
);

const DarkMode = ({ className = '' }: { className?: string }) => (
  <div
    className={`border-neutral-gray-400 bg-neutral-gray-900 flex w-[120px] flex-col gap-1.5 rounded-sm border-[0.5px] p-2.5 ${className}`}
  >
    <div className="flex gap-1">
      <div className="bg-neutral-gray-700 h-[11px] w-[11px] rounded-full"></div>
      <div className="bg-neutral-gray-700 grow rounded-xs"></div>
    </div>
    <div className="flex gap-1">
      <div className="bg-neutral-gray-700 h-[11px] w-[11px] rounded-full"></div>
      <div className="bg-utility-blue-dark-600 max-w-3/5 grow rounded-xs"></div>
    </div>
  </div>
);

const Accessibility = () => {
  const getUserDetailQuery = useGetUserDetail();
  const updateProfileQuery = useUpdateProfile();
  const [themeState, setThemeState] = useState<{
    initialTheme: ThemeOption;
    selectedTheme: ThemeOption;
  }>({
    initialTheme: 'auto',
    selectedTheme: 'auto',
  });
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState<number>(0);

  const showToast = (toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  };

  const onSave = useCallback(() => {
    if (themeState.selectedTheme === themeState.initialTheme) {
      showToast({
        type: 'warning',
        title: 'No changes found!',
        description: 'Please make some changes',
      });
      return;
    }

    const formData = new FormData();
    formData.append('theme', themeState.selectedTheme);

    updateProfileQuery.mutate(formData, {
      onSuccess: () => {
        setThemeState((prev) => ({
          ...prev,
          initialTheme: prev.selectedTheme,
        }));
        showToast({
          type: 'success',
          title: 'Accessibility updated successfully!',
        });
      },
      onError: (error) => {
        showToast({
          type: 'error',
          title: 'Unable to update accessibility',
          description: error.message,
        });
      },
    });
  }, [themeState, updateProfileQuery]);

  const onCancel = useCallback(() => {
    setThemeState((prev) => ({
      ...prev,
      selectedTheme: prev.initialTheme,
    }));
  }, []);

  useEffect(() => {
    const theme = getUserDetailQuery.data?.theme as ThemeOption | undefined;
    const resolvedTheme =
      theme === 'light' || theme === 'dark' || theme === 'auto'
        ? theme
        : 'auto';

    if (
      themeState.initialTheme === resolvedTheme &&
      themeState.selectedTheme === resolvedTheme
    ) {
      return;
    }

    setThemeState({
      initialTheme: resolvedTheme,
      selectedTheme: resolvedTheme,
    });
  }, [getUserDetailQuery.data, themeState.initialTheme, themeState.selectedTheme]);

  useRegisterSettingsHeaderActions(
    useMemo(() => ({
      saveBtnProps: {
        onClick: onSave,
        isLoading: updateProfileQuery.isPending,
        disabled: updateProfileQuery.isPending,
      },
      cancelBtnProps: {
        onClick: onCancel,
        disabled: updateProfileQuery.isPending,
      },
    }), [onCancel, onSave, updateProfileQuery.isPending])
  );

  return (
    <div className="text-neutral-gray-900 font-metropolis flex flex-col gap-3">
      <div className="leading-5 font-semibold">Accessibility</div>
      <div className="flex flex-col gap-1 text-xs leading-[18px] font-medium">
        <div>Appearance</div>
        <div className="text-neutral-gray-600">
          Choose light or dark mode, or switch your mode automatically based on
          your system settings.
        </div>
      </div>
      <div className="flex gap-4">
        <div
          className="flex cursor-pointer flex-col gap-1"
          onClick={() =>
            setThemeState((prev) => ({ ...prev, selectedTheme: 'light' }))
          }
        >
          <div
            className={`rounded-sm border ${themeState.selectedTheme === 'light' ? 'border-brand' : 'border-transparent'}`}
          >
            <LightMode
              className={themeState.selectedTheme === 'light' ? 'border-none!' : ''}
            />
          </div>
          <div className="text-neutral-gray-600 text-xs leading-[18px] font-medium">
            Light
          </div>
        </div>
        <div
          className="flex cursor-pointer flex-col gap-1"
          onClick={() =>
            setThemeState((prev) => ({ ...prev, selectedTheme: 'dark' }))
          }
        >
          <div
            className={`rounded-sm border ${themeState.selectedTheme === 'dark' ? 'border-brand' : 'border-transparent'}`}
          >
            <DarkMode
              className={themeState.selectedTheme === 'dark' ? 'border-none!' : ''}
            />
          </div>
          <div className="text-neutral-gray-600 text-xs leading-[18px] font-medium">
            Dark
          </div>
        </div>
        <div
          className="flex cursor-pointer flex-col gap-1"
          onClick={() =>
            setThemeState((prev) => ({ ...prev, selectedTheme: 'auto' }))
          }
        >
          <div
            className={`relative overflow-hidden rounded-sm border ${themeState.selectedTheme === 'auto' ? 'border-brand' : 'border-neutral-gray-400'}`}
          >
            <LightMode className="border-none! shadow-[0_4px_4px_0_rgba(0,45,255,0.19)]" />
            <DarkMode className="absolute top-1/3 left-1/3" />
          </div>
          <div className="text-xs leading-[18px] font-medium">Auto</div>
        </div>
      </div>

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </div>
  );
};

export default Accessibility;
