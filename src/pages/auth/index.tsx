import { Outlet } from 'react-router-dom';

import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';

const Auth = () => {
  return (
    <div className="relative flex h-dvh min-h-dvh w-full gap-4 p-4 outline-hidden">
      <div className="from-blue-crayola-c via-dodger-blue-c hidden w-full rounded-2xl bg-linear-90 to-transparent p-10 lg:block">
        <img
          src="/images/auth/auth-left-side.webp"
          className="aspect-square h-full w-full object-contain"
          alt="Auth-Image"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <ScrollableGradientContainer direction="vertical" className="mx-auto max-w-md">
        <main>
          <Outlet />
        </main>
      </ScrollableGradientContainer>
    </div>
  );
};

export default Auth;
