import { Link } from "react-router-dom";
import Button from "../../../components/button/Button";
import { RightArrowIcon } from "../../../icons";
import LineGrid from "../../../components/ui/LineGrid";

const HomeHero = () => {
  return (
    <div className="relative w-full h-fit overflow-hidden py-5 bg-gradient-to-t from-[#fe026b] to-transparent">
      <div className="flex justify-center items-center flex-col lg:flex-row gap-5 px-3 lg:px-16 py-5">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          <h1 className="text-3xl md:text-4xl leading-[48px] md:leading-[52px] lg:text-left font-semibold">
            <span className="bg-silver-duo bg-clip-text text-transparent">
              India's First Beauty Brand that Delivers Products Directly to the
              Customer
            </span>
          </h1>
          <h1 className="bg-silver-duo bg-clip-text text-transparent font-semibold tracking-wide py-5 text-4xl sm:text-5xl md:text-7xl">
            BEAUTINIQUE
          </h1>
          <h1 className="font-medium md:text-4xl text-3xl tracking-[16px] lg:tracking-[20px] opacity-80">
            ON THE WEB
          </h1>
          <Link to="/register" className="mt-8">
            <Button
              pattern="primary"
              content={"Register Now"}
              rightIcon={<RightArrowIcon className="w-5 h-5 fill-white" />}
              className="py-4 !px-6 !gap-3"
            />
          </Link>
        </div>
        <div className="relative flex items-center justify-center w-[518px] h-[351px]">
          <LineGrid className="absolute -top-10 -right-10 [&_line]:stroke-primary-50 [&_line]:opacity-50" />
          <div className='max-w-[300px] max-h-[280px] md:max-w-[370px] md:max-h-[340px] w-full h-full bg-[url("/images/logo/BQ.webp")] bg-cover bg-center bg-no-repeat bg-opacity-50 border' />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
