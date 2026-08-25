import { useEffect, useState, type ReactNode } from 'react';

const EXCLUDED_PATHS = ['/auth', '/'];

interface MobileBlockerProps {
  children: ReactNode;
  breakpoint?: number;
}

const MobileBlocker = ({ children, breakpoint = 1024 }: MobileBlockerProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
      setIsChecked(true);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Track route changes (react-router uses history API)
    const handleNavigation = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleNavigation);

    // Patch pushState/replaceState to catch programmatic navigations
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    history.pushState = (...args) => {
      origPush(...args);
      handleNavigation();
    };
    history.replaceState = (...args) => {
      origReplace(...args);
      handleNavigation();
    };

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('popstate', handleNavigation);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, [breakpoint]);

  // Don't render anything until we've checked screen size
  if (!isChecked) {
    return null;
  }

  const isExcluded = EXCLUDED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (isMobile && !isExcluded) {
    return (
      <main className="fixed inset-0 flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
        {/* Background image with opacity */}
        <div className="bg-auth-img absolute inset-0 bg-cover bg-center opacity-50"></div>

        <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[60vw] w-[70vw] -translate-x-1/2 -translate-y-1/2" />

        <div className="font-metropolis relative z-10 flex max-w-96 animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] flex-col items-center gap-4 p-6 text-center">
          <img
            src="/assets/icons/Commverse Logo - Final.svg"
            alt="logo"
            className="h-auto max-w-81 pb-4"
          />

          <div className="mt-2 flex flex-col gap-2">
            <p className="text-neutral-gray-900 text-[14px] leading-relaxed">
              For the best <span className="font-bold">3D experience</span>,
              please access Commverse Studio on a{' '}
              <span className="font-bold italic">desktop</span> or{' '}
              <span className="font-bold italic">laptop</span>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

export default MobileBlocker;
