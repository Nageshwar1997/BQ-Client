import { Link } from "react-router-dom";
import Button from "../../../components/button/Button";
import { RightArrowIcon } from "../../../icons";
import LineGrid from "../../../components/ui/LineGrid";
import useThemeStore from "../../../store/theme.store";

const HomeHero = () => {
  const { theme } = useThemeStore();
  return (
    <div className="relative w-full h-fit overflow-hidden py-5 bg-beautinique-gradient px-[5%]">
      <div className="flex justify-center items-center flex-col lg:flex-row gap-5 py-5">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          <div className="mb-6 rounded-full py-2 px-4 border border-primary-50 backdrop-blur-md">
            <img
              alt="award"
              src={`/images/home/announcement-${theme}.png`}
              className="w-56 base:w-64 relative h-full object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-4xl leading-10 md:leading-[48px] lg:text-left font-semibold">
            <span className="bg-silver-duo bg-clip-text text-transparent">
              India's First Beauty Brand that Delivers Products Directly to the
              Customer
            </span>
          </h1>
          <h1 className="bg-silver-duo bg-clip-text text-transparent font-semibold tracking-wide py-5 text-4xl sm:text-5xl md:text-7xl">
            BEAUTINIQUE
          </h1>
          <h1 className="font-medium text-2xl md:text-3xl lg:text-4xl tracking-[12px] lg:tracking-[16px] opacity-80">
            ON THE WEB
          </h1>
          <Link to="/register" className="mt-8">
            <Button
              pattern="secondary"
              content={"Register Now"}
              rightIcon={
                <RightArrowIcon className="w-5 h-5 fill-secondary-inverted" />
              }
              className="py-4 !px-6 !gap-3"
            />
          </Link>
        </div>
        <div className="relative flex items-center justify-center w-[518px] h-[351px]">
          <LineGrid className="absolute -top-10 -right-20 [&_line]:stroke-primary-50 [&_line]:opacity-50 z-0" />
          <div className='max-w-[300px] max-h-[280px] md:max-w-[350px] md:max-h-[310px] w-full h-full bg-[url("/images/logo/BQ.webp")] bg-cover bg-center bg-no-repeat bg-opacity-50 lg:mt-28 z-[1]' />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
