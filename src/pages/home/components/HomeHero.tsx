import useThemeStore from "../../../store/theme.store";
import { Link } from "react-router-dom";
import Button from "../../../components/button/Button";
import { RightArrowIcon } from "../../../icons";
import BgGradient from "./BgGradient";
import LineGrid from "../../../components/ui/LineGrid";

const HomeHero = () => {
  const { theme } = useThemeStore();

  return (
    <div className="relative flex flex-col justify-between overflow-hidden lg:h-[70dvh] border z-0 ">
      {/* Pink gradient */}
      <BgGradient className="absolute bottom-0 w-screen object-cover -z-10" />
      <div className="flex justify-center items-center flex-col lg:flex-row gap-[10%] lg:px-28 min-[1280px]:px-12 lg:pt-[10%] max-[360px]:px-3 md:pt-[18%] pt-[25%] max-[375px]:h-auto h-screen lg:h-auto ">
        <div className="flex flex-col items-start md:items-center lg:items-start">
          {/* Award */}
          <div className="mb-6 rounded-full py-2 pl-3 pr-4 border border-light home-announcement-chip flex items-center gap-2.5">
            <img
              alt=""
              src={
                theme === "dark"
                  ? "/images/home/announcement.png"
                  : "/images/home/announcement-light-mode.png"
              }
              width={0}
              height={0}
              sizes="100vw"
              className="md:w-[237px] w-[180px] relative  h-full object-contain border"
            />
            {/* <CtruhLogoIconGradient className="w-[55px]" /> */}
          </div>
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            <h1 className="font-degular md:text-[40px]  leading-[52px] text-4xl lg:text-left font-semibold">
              <span className="bg-silver-duo bg-clip-text text-transparent lg:mr-2">{`World’s First`}</span>
              <br className="lg:hidden" />
              <span className="bg-silver-duo bg-clip-text text-transparent">
                No-Code/Low-Code
              </span>
            </h1>
            <h1 className="bg-silver-duo bg-clip-text text-transparent  max-[360px]:text-[38px] md:text-[64px] text-[40px] font-semibold py-3 md:leading-[77px] leading-[48px]">
              3D ENGINE
            </h1>
            <h1 className="font-medium md:text-4xl text-3xl max-[360px]:text-[24px] tracking-[18px] lg:tracking-[22px] opacity-80">
              ON THE WEB
            </h1>
            <Link to="/register" className="mt-8">
              <Button
                pattern="primary"
                content={"Get Started"}
                rightIcon={
                  <RightArrowIcon
                    className="w-6 h-6"
                    // fill="var(--text-default-invert)"
                  />
                }
                // wrapperClassName="w-fit"
                className="!py-5 !px-6 !gap-[10px]"
              />
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center w-[518px] h-[351px] lg:mb-0 pointer-events-none lg:pointer-events-auto">
          <LineGrid className="absolute -top-10 -right-10 [&_line]:stroke-primary-50 [&_line]:opacity-50" />
          <div className='absolute md:h-[351px] md:w-[376px] w-[280px] h-[280px] aspect-square cursor-pointer  bg-[url("/images/logo/BQ.webp")] bg-cover bg-center bg-no-repeat bg-opacity-50 border'></div>
        </div>
      </div>
      {/* <BrandIcons isFade={true} /> */}
    </div>
  );
};

export default HomeHero;
