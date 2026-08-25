import { useEffect, useState, useCallback } from 'react';
import ToastCard from '../AlertCards/ToastCard';
import Modal from '../Modal';

type ConnectivityError = {
  status: 'offline' | 'connecting';
  title: string;
  description: string;
};

const CheckConnectivity = ({ onClose }: { onClose?: () => void }) => {
  const [error, setError] = useState<ConnectivityError | null>(null);

  const setOffline = useCallback(() => {
    setError({
      status: 'offline',
      title: 'You’re offline',
      description: 'Please check your internet connection to continue.',
    });
  }, []);

  const setConnecting = useCallback(() => {
    setError({
      status: 'connecting',
      title: 'Connecting',
      description: 'Checking internet connection.',
    });
  }, []);

  /**
   * Internet check using Google public endpoint
   */
  const checkInternet = useCallback(async () => {
    setConnecting();

    try {
      await fetch('https://www.google.com/generate_204', {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
      });

      // fetch resolved = internet OK
      setError(null);
    } catch {
      setOffline();
    }
  }, [setConnecting, setOffline]);

  const handleClose = () => {
    setError(null);
    onClose?.();
  };

  /* ================= LIFECYCLE ================= */

  useEffect(() => {
    const handleOnline = () => {
      checkInternet();
    };

    const handleOffline = () => {
      setOffline();
    };

    // Initial check
    if (!navigator.onLine) {
      setOffline();
    } else {
      checkInternet();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkInternet, setOffline]);

  /* ================= RENDER ================= */

  if (!error) return null;

  return (
    <Modal
      open={!!error}
      onClose={handleClose}
      className="items-end justify-end p-8 [&>div]:w-fit [&>div]:rounded-xl [&>div]:bg-transparent [&>div]:shadow-none! [&>div]:backdrop-blur-none!"
      closeOnOutsideClick={false}
    >
      <ToastCard
        className="static!"
        type="loading"
        title={error.title}
        description={error.description}
        isClosable={false}
        autoClose={false}
        buttonProps={
          error.status === 'offline'
            ? { content: 'Try Again', onClick: checkInternet }
            : undefined
        }
      />
    </Modal>
  );
};

export default CheckConnectivity;
