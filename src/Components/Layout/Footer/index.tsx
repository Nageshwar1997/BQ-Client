import { GradientText, Hr } from '@/Components/Ui';
import { FOOTER_AWARDS, FOOTER_CATEGORIES, SOCIAL_MEDIA_LINKS } from '@/Constants';
import { Hook } from '@/Hooks';
import { ThemeStore } from '@/Stores';
import type { IFooterOptionList } from '@/Types/Common.type';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

const FooterOptionList = ({ isFirst = false, title, options }: IFooterOptionList) => {
  const requireAuth = Hook.RequireAuth();
  const { navigate } = Hook.PathParams();

  const handleNavigate = (path: string, isPrivateRoute?: boolean) => {
    const action = () => navigate(path); // wrap in a function
    if (isPrivateRoute && !requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
  };

  return (
    <div className={`space-y-2 text-sm lg:text-base ${isFirst ? 'col-span-3 sm:col-span-1' : ''}`}>
      <p
        className={`text-platinum-black-invert font-medium uppercase ${
          isFirst ? 'hidden sm:block' : ''
        }`}
      >
        {title}
      </p>
      <div className={`grid grid-cols-1 ${isFirst ? 'grid-cols-2 sm:grid-cols-1' : ''} gap-2`}>
        {options.map((link, i) => (
          <button
            key={i}
            onClick={() => handleNavigate(link.path, link.private)}
            className="cursor-pointer text-nowrap"
          >
            {link.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Footer = () => {
  const { theme } = ThemeStore();
  return (
    <div className="w-full">
      <div className="border-y-primary/30 w-full space-y-6 border-y py-6 text-center md:px-4 lg:px-10 lg:py-10 xl:px-20">
        <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row lg:gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center">
              <Link to="/">
                <img
                  src={`/images/logo/BQ_${theme === 'dark' ? 'white' : 'black'}_logo.webp`}
                  alt="Logo"
                  className="h-10 w-full max-w-20 object-contain sm:h-12 lg:h-16 lg:max-w-24"
                />
              </Link>
              <span className="mr-1 min-w-3">
                <Hr />
              </span>
              <h1 className="text-primary text-[22px] font-[550] tracking-tight lg:text-[32px]">
                BEAUTINIQUE
              </h1>
            </div>
            <p className="text-primary ml-2.5 text-sm leading-none font-medium italic lg:text-xl">
              Pronounced <GradientText text="Beauty-Unique" type="accent" className="text-nowrap" />
            </p>
          </div>
          <div className="base:flex-row flex flex-col items-center justify-end gap-2 lg:gap-4">
            {FOOTER_AWARDS.map((award, ind) => (
              <Link key={ind} to="/awards">
                <img
                  src={`/images/footer/${award.key}-${theme}.webp`}
                  alt={award.name}
                  className="h-10 w-fit object-contain md:h-12 lg:h-14"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="text-battleship-davys-gray-invert mt-6 grid w-full grid-cols-2 gap-6 px-4 text-sm sm:grid-cols-3 md:px-0 lg:grid-cols-5 lg:gap-10 xl:gap-20">
          <div className="border-silver col-span-3 w-full border-b opacity-30 lg:hidden" />
          {FOOTER_CATEGORIES.map((category, index) => (
            <Fragment key={index}>
              {index === 1 && (
                <div className="border-b-silver col-span-3 w-full border-b opacity-30 sm:hidden" />
              )}
              <FooterOptionList
                isFirst={index === 0}
                title={category.title}
                options={category.options}
              />
              {index === 2 && (
                <div className="border-b-silver col-span-3 w-full border-b opacity-30 lg:hidden" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="my-6 flex w-full flex-col items-center justify-center gap-5 lg:flex-row-reverse">
        <div className="flex items-center gap-5">
          {SOCIAL_MEDIA_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link to={item.url} key={item.id} target="_blank" className="cursor-pointer">
                <Icon className="[&>g]:fill-primary-invert fill-battleship-davys-gray-invert" />
              </Link>
            );
          })}
        </div>
        <div className="text-battleship-davys-gray-invert px-[10%] text-center text-sm">
          &copy; 2025&nbsp; Beautinique Pvt. Ltd. All rights reserved. Designed with ♥ by&nbsp;
          <GradientText text="Nageshwar Pawar" type="accent" className="font-medium text-nowrap" />.
        </div>
      </div>
    </div>
  );
};
