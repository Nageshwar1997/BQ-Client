import { Outlet } from 'react-router-dom';

import ScrollableGradientContainer from '../../components/layout/containers/ScrollableGradientContainer';
import LeftSide from './children/LeftSide';
import { Theme } from '../../components';

const Auth = () => {
  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden p-4">
      <LeftSide />
      <Theme className="bg-secondary-invert stroke-secondary border-primary/30 absolute top-5 right-5 z-10 h-fit rounded-full border p-2 md:p-3" />
      <ScrollableGradientContainer
        direction="vertical"
        className="mx-auto max-w-md"
        children={<Outlet />}
      />
    </div>
  );
};

export default Auth;
