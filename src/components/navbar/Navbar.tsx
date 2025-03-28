import { useState, useRef, useEffect } from "react";
import {
  CareIcon,
  CashIcon,
  CloseIcon,
  DropdownIcon,
  GiftCardIcon,
  MenuIcon,
  TrackIcon,
} from "../../icons";
import UserMenuIcons from "./components/UserMenuIcons";
import { navbarCategoriesData } from "./data";
import SearchInput from "./components/SearchInput";
import { Link, useLocation } from "react-router-dom";
import HoveredComponent from "./components/HoveredComponent";
import Button from "../button/Button";
import { BottomGradient } from "../Gradients";

const Navbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();

  const [isMobileNavbarOpened, setIsMobileNavbarOpened] =
    useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isContainerHovered, setIsContainerHovered] = useState<boolean>(false);
  const [isNavbarAtTop, setIsNavbarAtTop] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

  const levelOneCategories = navbarCategoriesData.filter(
    (item) => item.level === 1
  );

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggles the accordion index: adds index if not present, removes if already active.
  const toggleAccordionIndex = (index: number) => {
    setActiveIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
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
        rootMargin: "-65px 0px 0px 0px",
      }
    );

    observer.observe(bottomElement);

    return () => {
      if (bottomElement) observer.unobserve(bottomElement);
    };
  }, []);

  // Close navbar when pathname changes
  useEffect(() => {
    setHoveredIndex(null);
    // setHoveredIndex(5); // remove it after testing
    setIsContainerHovered(false);
    setIsMobileNavbarOpened(false);
    // setIsMobileNavbarOpened(true); // remove it after testing
    setActiveIndices([]);
  }, [pathname]);

  // Disables body scroll when the mobile navbar is opened
  useEffect(() => {
    if (isMobileNavbarOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileNavbarOpened]);

  return (
    <div
      className={`h-16 lg:h-[100px] w-full flex justify-between items-center gap-3 lg:gap-0 xl:gap-5 sticky top-0 left-0 lg:-top-9 text-tertiary z-50 ${
        isNavbarAtTop || isNavbarHovered
          ? "bg-tertiary-inverted shadow-lg shadow-primary-inverted-50"
          : "bg-transparent"
      }`}
      onMouseEnter={() => setIsNavbarHovered(true)}
      onMouseLeave={() => setIsNavbarHovered(false)}
    >
      <div
        className="w-full h-full hidden lg:block"
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`h-9 flex items-center justify-between px-2 sm:px-5 text-secondary rounded-b-md bg-secondary-inverted`}
        >
          <p className="text-sm text-nowrap cursor-pointer lg:opacity-90 hover:opacity-100 transition-all duration-300">
            Beautinique Luxury
          </p>
          <div className="flex items-center gap-3 text-xs">
            <p className="flex items-center gap-0.5 cursor-pointer lg:opacity-90 hover:opacity-100 transition-all duration-300">
              <CashIcon className="w-3.5 h-3.5 pb-px [&>path]:stroke-secondary" />
              <span className="text-nowrap">BQ Cash</span>
            </p>
            <p className="flex items-center gap-0.5 cursor-pointer lg:opacity-90 hover:opacity-100 transition-all duration-300">
              <GiftCardIcon className="w-3.5 h-3.5 pb-px fill-secondary" />
              <span className="text-nowrap">Gift Card</span>
            </p>
            <p className="flex items-center gap-0.5 cursor-pointer lg:opacity-90 hover:opacity-100 transition-all duration-300">
              <CareIcon className="w-3.5 h-3.5 pb-px fill-secondary" />
              <span className="text-nowrap">BQ Care</span>
            </p>
            <p className="flex items-center gap-0.5 cursor-pointer lg:opacity-90 hover:opacity-100 transition-all duration-300">
              <TrackIcon className="w-3.5 h-3.5 pb-px [&>path]:stroke-secondary" />
              <span className="text-nowrap">Track Orders</span>
            </p>
          </div>
        </div>
        <div className="w-full h-16 flex items-center px-2 sm:px-5">
          <div className="h-12 sm:h-14 md:min-h-16 md:h-full flex items-center justify-center">
            <img
              src="./images/logo/BQ.webp"
              alt="Logo"
              className="object-contain w-fit max-h-16 h-full sticky top-0 left-0"
            />
          </div>
          <div
            className="h-full w-full flex items-center gap-7 justify-between pl-4 xl:pl-6 relative"
            ref={navbarRef}
          >
            <div className="flex items-center gap-2 h-full">
              {levelOneCategories.map((item, index) => (
                <div className="h-full relative" key={item.id}>
                  {/* Left Curve */}
                  {hoveredIndex === index && (
                    <div className="absolute left-px transform -translate-x-full bg-secondary-inverted bottom-0 h-3 w-3 z-[52]">
                      <div className="bg-tertiary-inverted h-full w-full rounded-br-full z-[51] border-b border-r border-primary-battleship-davys-gray" />
                    </div>
                  )}
                  <div
                    className={`h-full px-3 flex items-center justify-center gap-0.5 text-sm text-nowrap font-semibold cursor-pointer rounded-t-lg border-l border-r relative ${
                      hoveredIndex === index
                        ? "bg-secondary-inverted border-primary-battleship-davys-gray z-50"
                        : "border-transparent"
                    } ${isNavbarAtTop ? "border-t-transparent" : "border-t"}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                  >
                    <p
                      className={`${
                        hoveredIndex === index
                          ? "bg-clip-text text-transparent bg-accent-duo"
                          : ""
                      } ${
                        isNavbarAtTop || isNavbarHovered
                          ? ""
                          : "light:text-tertiary-inverted"
                      }`}
                    >
                      {item.label}
                    </p>
                    <DropdownIcon
                      className={`${
                        hoveredIndex === index
                          ? "rotate-180 [&>path]:stroke-blue-crayola-c"
                          : ""
                      } ${
                        isNavbarAtTop || isNavbarHovered
                          ? ""
                          : "light:[&>path]:stroke-tertiary-inverted"
                      } transition-transform duration-300`}
                    />
                  </div>
                  {/* Right Curve */}
                  {hoveredIndex === index && (
                    <div className="absolute right-px transform translate-x-full bg-secondary-inverted bottom-0 h-3 w-3 z-[52]">
                      <div className="bg-tertiary-inverted h-full w-full rounded-bl-full border-b border-l border-primary-battleship-davys-gray" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <SearchInput
              name="desktopSearch"
              className={`${
                isNavbarAtTop || isNavbarHovered
                  ? ""
                  : "border dark:border-tertiary light:border-tertiary-inverted bg-transparent light:[&>input]:placeholder:text-tertiary-inverted dark:[&>input]:placeholder:text-tertiary light:[&_svg>path]:stroke-tertiary-inverted dark:[&_svg>path]:stroke-tertiary"
              }`}
              onChange={(e) => console.log(e.target.value)}
            />
            <UserMenuIcons
              className={`${
                isNavbarAtTop || isNavbarHovered
                  ? ""
                  : "light:[&_svg>path]:stroke-tertiary-inverted"
              }`}
            />
            {(hoveredIndex !== null || isContainerHovered) && (
              <div
                className={`rounded-2xl absolute -left-5 top-[63px] w-auto h-fit z-[49] justify-self-center transition-all duration-300`}
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
      <div className="w-full flex items-center justify-between gap-2 px-2 sm:px-3 md:px-4 lg:hidden">
        <div className="h-12 md:h-14 max-h-14 flex items-center justify-center lg:hidden">
          <img
            src="./images/logo/BQ.webp"
            alt="Logo"
            className="object-cover w-fit h-full"
          />
        </div>
        <SearchInput
          name="mobileSearch"
          className="sm:!flex lg:!hidden h-7 md:h-8"
        />
        <div className="lg:hidden flex items-center gap-3 base:gap-5">
          {!isMobileNavbarOpened && <UserMenuIcons />}
          <span
            className="flex items-center justify-center"
            onClick={() => {
              setIsMobileNavbarOpened((prev) => !prev);
              setActiveIndices([]);
            }}
          >
            {isMobileNavbarOpened ? (
              <CloseIcon className="[&>path]:stroke-tertiary w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <MenuIcon className="[&>path]:stroke-tertiary w-5 h-5 md:w-6 md:h-6" />
            )}
          </span>
        </div>
        {isMobileNavbarOpened && (
          <div className="absolute top-16 left-0 w-full h-dvh bg-secondary-inverted flex flex-col z-50">
            <div className="h-[calc(100%-64px)] overflow-hidden overflow-y-scroll flex-grow">
              {levelOneCategories.map((category, index) => {
                const AccordionContentComponent = category.component;
                const isActive = activeIndices.includes(index);
                const isLastItem = index === levelOneCategories.length - 1;

                return (
                  <div
                    key={category.id}
                    className={`relative ${isLastItem && "mb-36"}`}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer sticky top-0 z-50 bg-secondary-inverted border-b border-primary-battleship-davys-gray-inverted pl-6 pr-4 py-4"
                      onClick={() => toggleAccordionIndex(index)}
                    >
                      <p className="text-primary">{category.label}</p>
                      <DropdownIcon
                        className={`[&>path]:stroke-2 ${
                          isActive ? "rotate-180" : ""
                        }`}
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

            <div className="fixed bottom-0 left-0 w-full flex gap-5 md:gap-10 justify-center items-center px-6 py-2 pt-8 z-[51]">
              <BottomGradient className="!w-full" />
              <Link to={"/login"} className="w-1/2 sm:w-1/3 md:w-1/4 z-[51]">
                <Button
                  content="Login"
                  pattern="primary"
                  className="!rounded-lg !px-6 !py-3"
                />
              </Link>
              <Link to={"/register"} className="w-1/2 sm:w-1/3 md:w-1/4 z-[51]">
                <Button
                  content="Register"
                  pattern="secondary"
                  className="!rounded-lg !px-6 !py-3"
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
