import { useEffect } from 'react';
import type { HeaderActions } from '../pages/settings';
import { useSettingsHeader } from './useSettingsHeader';

export const useRegisterSettingsHeaderActions = (actions: HeaderActions) => {
  const { setHeaderActions } = useSettingsHeader();

  useEffect(() => {
    setHeaderActions(actions);
  }, [actions, setHeaderActions]);
};
