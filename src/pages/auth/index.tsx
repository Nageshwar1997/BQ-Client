import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import Theme from '@/components/ui/Theme';
import { Outlet } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="relative flex h-dvh min-h-dvh w-full gap-4 p-4 outline-hidden">
      <div className="from-blue-crayola-c via-dodger-blue-c hidden w-full rounded-2xl bg-linear-90 to-transparent p-10 lg:block">
        <img
          src="/images/auth/auth-left-side.webp"
          className="aspect-square h-full w-full object-contain"
          alt="Auth-Image"
          loading="eager"
        />
      </div>
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
