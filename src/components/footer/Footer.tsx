import { Fragment } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme.store";
import { awards, footerCategories, socialMediaLinks } from "./data";
import FooterOptionList from "./FooterOptionList";

const Footer = () => {
  const { theme } = useThemeStore();
  return (
    <div className="w-full">
      <div className="w-full text-center space-y-6 py-6 md:px-4 lg:px-10 xl:px-20 lg:py-10">
        <div className="w-full flex flex-col md:flex-row gap-2 lg:gap-4 items-center justify-between">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center">
              <Link to="/">
                <img
                  src="/images/logo/BQ_white_logo.webp"
                  alt="Logo"
                  className="object-contain max-w-20 lg:max-w-24 w-full h-10 sm:h-12 lg:h-16 mix-blend-difference"
                />
              </Link>
              <span className="mr-1 min-w-3">
                <hr className="h-px block border-none bg-gradient-line" />
              </span>
              <h1 className="font-[550] tracking-tight text-[22px] lg:text-[32px] text-primary">
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
          <div className="flex flex-col base:flex-row items-center justify-end gap-2 lg:gap-4">
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
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10 xl:gap-20 mt-6 text-primary-battleship-davys-gray-inverted text-sm px-4 md:px-0">
          <div className="border-b w-full border-silver opacity-30 col-span-3 lg:hidden" />
          {footerCategories.map((category, index) => (
            <Fragment key={index}>
              {index === 1 && (
                <div className="border-b w-full border-silver opacity-30 col-span-3 sm:hidden" />
              )}
              <FooterOptionList
                isFirst={index === 0}
                title={category.title}
                options={category.options}
              />
              {index === 2 && (
                <div className="border-b w-full border-silver opacity-30 lg:hidden col-span-3" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="border-b w-full border-silver opacity-30" />
      <div className="w-full flex flex-col lg:flex-row-reverse items-center justify-center gap-5 my-6">
        <div className="flex gap-5 items-center">
          {socialMediaLinks.map((item) => (
            <Link
              to={item.url}
              key={item.id}
              target="_blank"
              className="[&>svg>_g]:fill-primary-inverted [&>svg>path]:fill-primary-battleship-davys-gray-inverted cursor-pointer"
            >
              {item.icon}
            </Link>
          ))}
        </div>
        <div className="px-[10%] text-sm text-primary-battleship-davys-gray-inverted text-center">
          &copy; 2025&nbsp; Beautinique Pvt. Ltd. All rights reserved. Designed
          with ♥ by
          <span className="bg-clip-text text-transparent bg-accent-duo text-nowrap font-medium">
            &nbsp;Nageshwar Pawar
          </span>
          .
        </div>
      </div>
    </div>
  );
};

export default Footer;
