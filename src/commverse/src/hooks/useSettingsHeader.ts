import { useOutletContext } from 'react-router';
import type { HeaderActions } from '../pages/settings';

type ContextType = {
  setHeaderActions: (actions: HeaderActions) => void;
};

export const useSettingsHeader = () => {
  const context = useOutletContext<ContextType | null>();

  if (!context) {
    throw new Error(
      'useSettingsHeader must be used inside the Settings outlet context'
    );
  }

  return context;
};
