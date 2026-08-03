import useAuthAction from './useAuthAction';
import usePathParams from './usePathParams';

// Navigates immediately for public paths; for private ones, runs the navigation only once the
// user is authenticated (queuing it and opening the login modal otherwise).
const useAuthNavigate = () => {
  const { navigate } = usePathParams();
  const { runAction } = useAuthAction();

  return (path: string, isPrivate?: boolean) => {
    const action = () => navigate(path);

    if (isPrivate) {
      runAction(action);
      return;
    }

    void action();
  };
};

export default useAuthNavigate;
