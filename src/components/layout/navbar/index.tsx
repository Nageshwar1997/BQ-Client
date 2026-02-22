import { useEffect, useRef, useState } from 'react';
import { NAVBAR_CATEGORIES_DATA, NAVBAR_TOP_LAYER_DATA } from '../../../Constants';
import { Hook } from '../../../Hooks';
import { Store } from '../../../Store';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, CloseIcon, MenuIcon } from '../../../Icons';
import { HoveredComponent, UserMenuIcons } from './Children';
import { Button, LinearGradient } from '@/Components/UI';

const TopLayer = () => {
  const requireAuth = Hook.RequireAuth();
  const { navigate } = Hook.PathParams();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    const action = () => navigate(path); // wrap in a function
    if (isPrivateRoute && !requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
  };
  return (
    <div className="text-secondary bg-secondary-invert flex h-9 items-center justify-between rounded-b-md px-2 sm:px-5">
      <p className="text-sm opacity-80">Beautinique Luxury</p>
      <div className="flex items-center gap-3 text-xs">
        {NAVBAR_TOP_LAYER_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.text}
              onClick={() => handleNavigate(item.path, item.private)}
              className="flex cursor-pointer items-center gap-0.5 transition-all duration-300 hover:opacity-100 lg:opacity-80"
            >
              <Icon className={`h-3.5 w-3.5 pb-px ${item.className}`} />
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Navbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const { authenticated } = Store.User();

  const { paths, pathname, navigate } = Hook.PathParams();

  const [isMobileNavbarOpened, setIsMobileNavbarOpened] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isContainerHovered, setIsContainerHovered] = useState<boolean>(false);
  const [isNavbarAtTop, setIsNavbarAtTop] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

  const levelOneCategories = NAVBAR_CATEGORIES_DATA.filter((item) => item.level === 1);

  // Sets the hovered index when mouse enters an element
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    if (!isNavbarAtTop || !isNavbarHovered) {
      setIsNavbarHovered(true);
    }
  };

  // Sets container hover state to true when mouse enters the container
  const handleContainerMouseEnter = () => setIsContainerHovered(true);

  // Resets hovered index and container hover state when mouse leaves
  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsContainerHovered(false);
  };

  // Handles the event when the user clicks outside the navbar.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        navbarRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        handleMouseLeave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggles the accordion index: adds index if not present, removes if already active.
  const toggleAccordionIndex = (index: number) => {
    setActiveIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    const bottomElement = navbarRef.current;
    if (!bottomElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavbarAtTop(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-65px 0px 0px 0px',
      },
    );

    observer.observe(bottomElement);

    return () => {
      if (bottomElement) observer.unobserve(bottomElement);
    };
  }, []);

  // Close navbar when pathname changes
  useEffect(() => {
    setHoveredIndex(null);
    setIsContainerHovered(false);
    setIsMobileNavbarOpened(false);
    setActiveIndices([]);
    setIsNavbarHovered(false);
  }, [pathname]);

  // Disables body scroll when the mobile navbar is opened
  useEffect(() => {
    if (isMobileNavbarOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileNavbarOpened]);

  const nonTransparent = ['product', 'cart', 'offers', 'blogs', 'account'].some((val) =>
    paths.includes(val),
  );

  return (
    <div
      className={`text-tertiary sticky top-0 left-0 z-50 flex h-16 w-full items-center justify-between gap-3 lg:-top-9 lg:h-25 lg:gap-0 xl:gap-5 ${
        isNavbarAtTop || isNavbarHovered || nonTransparent
          ? 'bg-tertiary-invert shadow-primary-invert/50 shadow-lg'
          : 'bg-transparent'
      } ${paths.includes('account') ? 'lg:top-0!' : ''}`}
      onMouseEnter={() => setIsNavbarHovered(true)}
      onMouseLeave={() => setIsNavbarHovered(false)}
    >
      <div className="hidden h-full w-full lg:block" onMouseLeave={handleMouseLeave}>
        <TopLayer />
        <div className="flex h-16 w-full items-center px-2 sm:px-5">
          <Link
            to="/"
            className="flex h-12 items-center justify-center sm:h-14 md:h-full md:min-h-16"
          >
            <img
              src="/images/logo/BQ_gradient_logo.webp"
              alt="Logo"
              className="sticky top-0 left-0 h-full max-h-16 w-fit object-contain"
            />
          </Link>
          <div className="relative flex h-full w-full items-center justify-between gap-7 pl-4 xl:pl-6">
            <div className="flex h-full items-center gap-2" ref={navbarRef}>
              {levelOneCategories.map((item, index) => (
                <div
                  onClick={() => item?.path && navigate(item.path)}
                  className="relative h-full"
                  key={item.id}
                >
                  {/* Left Curve */}
                  {hoveredIndex === index && (
                    <div className="bg-secondary-invert absolute bottom-0 left-px z-52 h-3 w-3 -translate-x-full transform">
                      <div className="bg-tertiary-invert border-battleship-davys-gray z-51 h-full w-full rounded-br-full border-r border-b" />
                    </div>
                  )}
                  <div
                    className={`relative flex h-full items-center justify-center gap-0.5 rounded-t-lg border-r border-l px-3 text-sm font-semibold text-nowrap ${
                      hoveredIndex === index
                        ? 'bg-secondary-invert border-battleship-davys-gray z-50'
                        : 'border-transparent'
                    } ${isNavbarAtTop ? 'border-t-transparent' : 'border-t'} ${
                      item.path ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    onMouseEnter={() => handleMouseEnter(index)}
                  >
                    <p
                      className={`text-tertiary ${
                        hoveredIndex === index ? 'bg-accent-duo bg-clip-text text-transparent' : ''
                      } ${
                        isNavbarAtTop || isNavbarHovered || nonTransparent
                          ? ''
                          : 'light:text-tertiary-invert'
                      }`}
                    >
                      {item.label}
                    </p>
                    <ChevronDownIcon
                      className={`stroke-tertiary ${
                        hoveredIndex === index ? 'stroke-blue-crayola-c! rotate-180' : ''
                      } ${
                        isNavbarAtTop || isNavbarHovered || nonTransparent
                          ? ''
                          : 'light:stroke-tertiary-invert'
                      } transition-transform duration-300`}
                    />
                  </div>
                  {/* Right Curve */}
                  {hoveredIndex === index && (
                    <div className="bg-secondary-invert absolute right-px bottom-0 z-52 h-3 w-3 translate-x-full transform">
                      <div className="bg-tertiary-invert border-battleship-davys-gray h-full w-full rounded-bl-full border-b border-l" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <UserMenuIcons
              closeOnNavbarLeave={!isNavbarHovered}
              className={`${
                isNavbarAtTop || isNavbarHovered || nonTransparent
                  ? ''
                  : '[&_svg]:light:stroke-tertiary-invert'
              }`}
            />
            {(hoveredIndex !== null || isContainerHovered) && (
              <div
                className={`absolute top-15.75 -left-5 z-49 h-fit w-auto justify-self-center rounded-2xl transition-all duration-300`}
                ref={containerRef}
                onMouseEnter={handleContainerMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {<HoveredComponent index={hoveredIndex as number} />}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navbar */}
      <div className="flex w-full items-center justify-between gap-2 px-2 sm:px-3 md:px-4 lg:hidden">
        <Link to="/" className="flex h-12 max-h-14 items-center justify-center md:h-14 lg:hidden">
          <img
            src="/images/logo/BQ_gradient_logo.webp"
            alt="Logo"
            className="h-full w-fit object-cover"
          />
        </Link>
        <div className="base:gap-5 flex items-center gap-3 lg:hidden">
          {!isMobileNavbarOpened && <UserMenuIcons />}
          <span
            className="flex items-center justify-center"
            onClick={() => {
              setIsMobileNavbarOpened((prev) => !prev);
              setActiveIndices([]);
            }}
          >
            {isMobileNavbarOpened ? (
              <CloseIcon className="stroke-tertiary size-6 md:size-8" />
            ) : (
              <MenuIcon className="stroke-tertiary size-5 md:size-6" />
            )}
          </span>
        </div>
        {isMobileNavbarOpened && (
          <div className="bg-secondary-invert absolute top-16 left-0 z-50 flex h-dvh w-full flex-col">
            <div className="h-[calc(100%-64px)] grow overflow-hidden overflow-y-scroll">
              {levelOneCategories.map((category, index) => {
                const AccordionContentComponent = category.component;
                const isActive = activeIndices.includes(index);
                const isLastItem = index === levelOneCategories.length - 1;

                return (
                  <div key={category.id} className={`relative ${isLastItem && 'mb-36'}`}>
                    <div
                      className="bg-secondary-invert border-battleship-davys-gray-invert sticky top-0 z-50 flex cursor-pointer items-center justify-between border-b py-4 pr-4 pl-6"
                      onClick={() => toggleAccordionIndex(index)}
                    >
                      <p className="text-primary">{category.label}</p>
                      <ChevronDownIcon
                        className={`stroke-primary stroke-2 ${isActive ? 'rotate-180' : ''}`}
                      />
                    </div>
                    {isActive && AccordionContentComponent && (
                      <div className="overflow-y-scroll">
                        <AccordionContentComponent />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!authenticated && (
              <div className="fixed bottom-0 left-0 z-51 flex w-full items-center justify-center gap-5 px-6 py-2 pt-8 md:gap-10">
                <LinearGradient position="bottom" className="w-full!" />
                <Link to={'/login'} className="z-51 w-1/2 sm:w-1/3 md:w-1/4">
                  <Button content="Login" pattern="primary" className="rounded-lg! px-6! py-3!" />
                </Link>
                <Link to={'/register'} className="z-51 w-1/2 sm:w-1/3 md:w-1/4">
                  <Button
                    content="Register"
                    pattern="secondary"
                    className="rounded-lg! px-6! py-3!"
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export {
  About,
  CategoryLabel,
  Collections,
  Eyes,
  Face,
  Feedback,
  ForYou,
  HoveredComponent,
  Lips,
  Skin,
  SubCategories,
  UserMenuIcons,
} from './Children';
