import useThemeStore from "../../store/theme.store";
import { awards } from "./data";

const Footer = () => {
  const { theme } = useThemeStore();
  return (
    <div className="w-full text-center space-y-6 py-6 md:px-4 lg:px-20 lg:py-10">
      <div className="w-full flex flex-col md:flex-row gap-2 lg:gap-4 items-center justify-between">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center justify-center">
            <img
              src="./images/logo/BQ.webp"
              alt="Logo"
              className="object-contain max-w-20 lg:max-w-24 border w-full h-10 sm:h-12 lg:h-16"
            />
            <span className="mr-3 lg:mr-4 min-w-3">
              <hr className="h-px block border-none bg-gradient-line" />
            </span>
            <h1 className="font-[550] tracking-tight text-[22px] lg:text-[32px] bg-clip-text text-transparent bg-golden-gradient">
              BEAUTINIQUE
            </h1>
          </div>
          <p className="italic font-medium text-sm lg:text-xl text-primary ml-2.5 leading-none">
            Pronounced{" "}
            <span className="bg-clip-text text-transparent bg-accent-duo text-nowrap">
              Beauty-Unique
            </span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 lg:gap-4">
          {awards.map((award, ind) => (
            <img
              key={ind}
              src={theme === "dark" ? award.darkImage : award.lightImage}
              alt={award.name}
              className="w-fit h-10 md:h-12 lg:h-14 object-contain"
            />
          ))}
        </div>
      </div>
      <div className="w-full h-40"></div>
    </div>
  );
};

export default Footer;
