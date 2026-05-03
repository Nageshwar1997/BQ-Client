import useActionsStore from '@/stores/action.store';
import { useEffect } from 'react';

const useAutoRetry = () => {
  useEffect(() => {
    const handleOnline = () => {
      useActionsStore.getState().runAllActions();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};

export default useAutoRetry;
