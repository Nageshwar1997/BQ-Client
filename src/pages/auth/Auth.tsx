import { Outlet } from 'react-router-dom';

import ScrollableGradientContainer from '../../components/layout/containers/ScrollableGradientContainer';
import LeftSide from './children/LeftSide';
import { useVerticalScrollable } from '../../hooks';
import { Theme } from '../../components';

const Auth = () => {
  const { showGradient, containerRef } = useVerticalScrollable();

  console.log('auth', showGradient);

  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden p-4">
      <LeftSide />
      <Theme className="bg-secondary-invert stroke-secondary! absolute top-5 right-5 z-10 h-fit rounded-full border p-2 md:p-3" />
      <ScrollableGradientContainer
        className={`mx-auto flex w-full! max-w-md flex-1 ${!showGradient.bottom && !showGradient.top ? 'items-center' : 'items-start'}`}
        children={<Outlet />}
        ref={containerRef}
        gradient={showGradient}
      />
    </div>
  );
};

export default Auth;
