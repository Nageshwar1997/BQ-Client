import { Icon } from '@iconify/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button';
import LinearGradient from '@/components/ui/LinearGradient';
import { ABOUT, FOR_YOU, NAVBAR_TOP_LAYER_DATA } from '@/constants/navbar.constants';
import { ROUTES } from '@/constants/routes.constants';
import useAuthAction from '@/hooks/useAuthAction';
import usePathParams from '@/hooks/usePathParams';
import { useGetCategoriesHierarchy } from '@/services/product-service/category.service.query';
import useUserStore from '@/stores/user.store';
import type { TCategoryHierarchy } from '@/types/api.type';
import type { IClassName } from '@/types/component.type';
import { resolveCategoryPath, toaster } from '@/utils/common.util';

import { Feedback, type IUserMenuIconsHandle, UserMenuIcons } from './children/grand-children';
import HoveredCategory from './children/HoveredCategory';

const TopLayer = () => {
  const { runAction } = useAuthAction();
  const { navigate } = usePathParams();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    const action = () => navigate(path); // wrap in a function

    if (isPrivateRoute) {
      runAction(action); // queue
      return;
    }
    void action(); // run immediately if logged in
  };
  return (
    <div className="text-secondary bg-secondary-invert flex h-9 items-center justify-between rounded-b-md px-2 sm:px-5">
      <p className="text-sm opacity-80">Beautinique Luxury</p>
      <div className="flex items-center gap-3 text-xs [*_svg]:size-3.5">
        {NAVBAR_TOP_LAYER_DATA.map((item) => {
          return (
            <button
              key={item.text}
              onClick={() => {
                handleNavigate(item.path, 'private' in item ? item.private : false);
              }}
              className="flex cursor-pointer items-center gap-0.5 transition-all duration-300 hover:opacity-100 lg:opacity-80"
            >
              <Icon icon={item.icon} />
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Category = ({
  isCatHovered,
  isNavbarAtTop,
  isNavbarHovered,
  isNonTransparent,
  onMouseEnter,
  category,
  className = '',
}: IClassName & {
  isCatHovered: boolean;
  isNavbarAtTop: boolean;
  isNavbarHovered: boolean;
  isNonTransparent: boolean;
  onMouseEnter: (catId: string) => void;
  category: Pick<TCategoryHierarchy, '_id' | 'path' | 'slug' | 'name'>;
}) => {
  return (
    <div className={`h-full ${className}`}>
      {/* Left Curve */}
      {isCatHovered && (
        <div className="bg-secondary-invert absolute bottom-0 left-px z-52 h-3 w-3 -translate-x-full transform">
          <div className="bg-tertiary-invert border-battleship-davys-gray z-51 h-full w-full rounded-br-full border-r border-b" />
        </div>
      )}
      <div
        className={`relative flex h-full items-center justify-center gap-0.5 rounded-t-lg border-r border-l px-3 text-sm font-semibold text-nowrap ${
          isCatHovered
            ? 'bg-secondary-invert border-battleship-davys-gray z-50'
            : 'border-transparent'
        } ${isNavbarAtTop ? 'border-t-transparent' : 'border-t'} ${
          (category.path ?? category.slug) ? 'cursor-pointer' : 'cursor-default'
        }`}
        onMouseEnter={() => {
          onMouseEnter(category._id);
        }}
      >
        <p
          className={`text-tertiary ${
            isCatHovered ? 'bg-accent-duo bg-clip-text text-transparent' : ''
          } ${
            !(isNavbarAtTop || isNavbarHovered || isNonTransparent)
              ? 'light:text-tertiary-invert'
              : ''
          }`}
        >
          {category.name}
        </p>
        <Icon
          icon="solar:alt-arrow-down-linear"
          className={`text-tertiary size-6 ${
            isCatHovered ? 'text-blue-crayola-c! rotate-180' : ''
          } ${
            !(isNavbarAtTop || isNavbarHovered || isNonTransparent)
              ? 'light:text-tertiary-invert'
              : ''
          } transition-transform duration-300 ease-in-out`}
        />
      </div>
      {/* Right Curve */}
      {isCatHovered && (
        <div className="bg-secondary-invert absolute right-px bottom-0 z-52 h-3 w-3 translate-x-full transform">
          <div className="bg-tertiary-invert border-battleship-davys-gray h-full w-full rounded-bl-full border-b border-l" />
        </div>
      )}
    </div>
  );
};

export const Navbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const userMenuIconsRef = useRef<IUserMenuIconsHandle>(null);

  const { data, isError, error } = useGetCategoriesHierarchy();

  const authenticated = useUserStore((s) => s.authenticated);

  const { paths, pathname, navigate } = usePathParams();

  const [isMobileNavbarOpened, setIsMobileNavbarOpened] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isContainerHovered, setIsContainerHovered] = useState<boolean>(false);
  const [isNavbarAtTop, setIsNavbarAtTop] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const isMountedRef = useRef(false);

  const categories = useMemo(() => [FOR_YOU, ...(data ?? []), ABOUT], [data]);

  const isNonTransparent = [ROUTES.PRODUCTS.BASE].some((val) => paths.includes(val));

  const hoveredCategoryData = useMemo(() => {
    return categories.find((category) => category._id === hoveredId);
  }, [categories, hoveredId]);

  const isHomeRoute = pathname === ROUTES.HOME;

  // Sets the hovered index when mouse enters an element
  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
    if (!isNavbarAtTop || !isNavbarHovered) {
      setIsNavbarHovered(true);
    }
  };

  // Sets container hover state to true when mouse enters the container
  const handleContainerMouseEnter = () => {
    setIsContainerHovered(true);
  };

  // Resets hovered category and container hover state when mouse leaves
  const handleMouseLeave = () => {
    setHoveredId(null);
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
        setIsNavbarAtTop(!entry?.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-65px 0px 0px 0px',
      },
    );

    observer.observe(bottomElement);

    return () => {
      observer.unobserve(bottomElement);
    };
  }, []);

  // Close navbar when pathname changes
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    setHoveredId(null);
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

  useEffect(() => {
    if (isError) {
      toaster.error({ title: 'Oops! Error', description: error.message });
    }
  }, [isError, error]);

  return (
    <div
      className={`text-tertiary sticky top-0 left-0 z-50 flex h-16 w-full items-center justify-between gap-3 lg:-top-9 lg:h-25 lg:gap-0 xl:gap-5 ${
        isNavbarAtTop || isNavbarHovered || isNonTransparent || !isHomeRoute
          ? 'bg-tertiary-invert shadow-primary-invert/50 shadow-lg'
          : 'bg-transparent'
      } ${paths.includes('account') ? 'lg:top-0!' : ''}`}
      onMouseEnter={() => {
        setIsNavbarHovered(true);
      }}
      onMouseLeave={() => {
        setIsNavbarHovered(false);
        userMenuIconsRef.current?.close();
      }}
    >
      <div className="hidden h-full w-full lg:block" onMouseLeave={handleMouseLeave}>
        <TopLayer />
        <div className="flex h-16 w-full items-center px-2 sm:px-5">
          <Link
            to={ROUTES.HOME}
            className="flex h-12 items-center justify-center sm:h-14 md:h-full md:min-h-16"
          >
            <img
              src="/images/logo/BQ_gradient_logo.webp"
              alt="Logo"
              className="sticky top-0 left-0 h-full max-h-16 w-fit object-contain"
            />
          </Link>
          <div className="relative flex h-full w-full items-center justify-between gap-7 pl-4 xl:pl-6">
            <div className="flex h-full flex-1 items-center gap-2" ref={navbarRef}>
              {categories.map(({ _id, name, slug, path }, index) => {
                const props = {
                  isCatHovered: hoveredId === _id,
                  isNavbarAtTop: isNavbarAtTop,
                  isNavbarHovered: isNavbarHovered,
                  isNonTransparent: isNonTransparent,
                  onMouseEnter: handleMouseEnter,
                  category: { _id, name, slug, path },
                };

                const target = resolveCategoryPath(path, slug);
                return target ? (
                  <Link className="relative block h-full" key={index} to={target}>
                    <Category {...props} />
                  </Link>
                ) : (
                  <Category key={index} {...props} className="relative" />
                );
              })}
            </div>
            <UserMenuIcons
              ref={userMenuIconsRef}
              className={isNavbarAtTop || isNavbarHovered || isNonTransparent ? '' : ''}
            />
            {(hoveredId ?? isContainerHovered) && (
              <div
                className={`absolute top-15.75 -left-5 z-49 h-fit w-auto justify-self-center rounded-2xl transition-all duration-300`}
                ref={containerRef}
                onMouseEnter={handleContainerMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {!!(hoveredId && hoveredCategoryData) && (
                  <div className="bg-battleship-davys-gray h-full max-w-325 rounded-xl p-px backdrop-blur-3xl">
                    <div className="text-secondary bg-secondary-invert space-y-4 rounded-xl p-4">
                      <HoveredCategory category={hoveredCategoryData} />
                      <Feedback />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navbar */}
      <div className="flex w-full items-center justify-between gap-2 px-2 sm:px-3 md:px-4 lg:hidden">
        <Link
          to={ROUTES.HOME}
          className="flex h-12 max-h-14 items-center justify-center md:h-14 lg:hidden"
        >
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
            <Icon
              icon={isMobileNavbarOpened ? 'lucide:x' : 'lucide:menu'}
              className="text-tertiary size-5 md:size-6"
            />
          </span>
        </div>
        {isMobileNavbarOpened && (
          <div className="bg-secondary-invert absolute top-16 left-0 z-50 flex h-dvh w-full flex-col">
            <div className="h-[calc(100%-64px)] grow overflow-hidden overflow-y-scroll">
              {categories.map((category, index) => {
                const isActive = activeIndices.includes(index);
                const isLastItem = index === categories.length - 1;

                return (
                  <div key={index} className={`relative ${isLastItem ? 'mb-36' : ''}`}>
                    <div
                      className="bg-secondary-invert border-battleship-davys-gray-invert sticky top-0 z-50 flex cursor-pointer items-center justify-between border-b py-4 pr-4 pl-6"
                      onClick={() => {
                        toggleAccordionIndex(index);
                      }}
                    >
                      <p className="text-primary">{category.name}</p>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:alt-arrow-down-linear"
                          className={`text-primary hover:text-blue-crayola-c size-6 transition-colors duration-300`}
                          onClick={(e) => {
                            const target = resolveCategoryPath(category.path, category.slug);

                            if (!target) return;
                            e.stopPropagation();
                            void navigate(target);
                          }}
                        />
                        <Icon
                          icon="solar:alt-arrow-down-linear"
                          className={`text-primary size-6 transition-transform duration-300 ease-in-out ${isActive ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                    {isActive && (
                      <div className="overflow-y-scroll p-4">
                        <HoveredCategory category={category} />
                        <Feedback />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!authenticated && (
              <div className="fixed bottom-0 left-0 z-51 flex w-full items-center justify-center gap-5 px-6 py-2 pt-8 md:gap-10">
                <LinearGradient position="bottom" className="w-full!" />
                <Link to={`/${ROUTES.AUTH.BASE}`} className="z-51 w-1/2 sm:w-1/3 md:w-1/4">
                  <Button content="Login" pattern="primary" className="rounded-lg! px-6! py-3!" />
                </Link>
                <Link
                  to={`/${ROUTES.AUTH.BASE}/${ROUTES.AUTH.REGISTER}`}
                  className="z-51 w-1/2 sm:w-1/3 md:w-1/4"
                >
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
