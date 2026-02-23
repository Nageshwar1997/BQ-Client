import { ScrollableGradientContainer, Theme } from '@/Components';
import { Outlet } from 'react-router-dom';

export const Auth = () => {
  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden p-4">
      <div className="hidden w-full rounded-2xl bg-linear-90 from-[#00F] to-transparent p-10 lg:block">
        <img
          src="/images/auth/auth-left-side.webp"
          className="aspect-square h-full w-full object-contain"
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
