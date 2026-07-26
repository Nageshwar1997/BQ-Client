import { Icon } from '@iconify/react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import { FOOTER_AWARDS, FOOTER_CATEGORIES, SOCIAL_MEDIA_LINKS } from '@/constants/footer.constants';
import useAuthAction from '@/hooks/useAuthAction';
import usePathParams from '@/hooks/usePathParams';
import useThemeStore from '@/stores/theme.store';
import { type IFooterOptionList } from '@/types/component.type';

const FooterOptionList = ({ isFirst = false, title, options }: IFooterOptionList) => {
  const { runAction } = useAuthAction();
  const { navigate } = usePathParams();

  const handleNavigate = (path: string, isPrivate?: boolean) => {
    const action = () => navigate(path);

    if (isPrivate) {
      runAction(action);
      return;
    }

    void action();
  };

  return (
    <div className={`space-y-2 text-sm lg:text-base ${isFirst ? 'col-span-3 sm:col-span-1' : ''}`}>
      <p
        className={`text-platinum-black-invert base:tracking-widest mb-4 font-medium uppercase ${
          isFirst ? 'hidden sm:block' : ''
        }`}
      >
        {title}
      </p>
      <div className={`grid grid-cols-1 ${isFirst ? 'grid-cols-2 sm:grid-cols-1' : ''} gap-2`}>
        {options.map((link, i) => (
          <button
            key={i}
            onClick={() => {
              handleNavigate(link.path, link.private);
            }}
            className="hover:text-tertiary mx-auto w-fit cursor-pointer text-nowrap hover:font-medium hover:underline"
          >
            {link.title}
          </button>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  const theme = useThemeStore((s) => s.theme);

  const year = new Date().getFullYear();

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
                  loading="lazy"
                  className="h-10 w-full max-w-20 object-contain sm:h-12 lg:h-16 lg:max-w-24"
                />
              </Link>
              <span className="mr-1 min-w-3">
                <Divider />
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
                  loading="lazy"
                  className="h-10 w-fit object-contain md:h-12 lg:h-14"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="text-battleship-davys-gray-invert mt-6 grid w-full grid-cols-2 gap-6 px-4 text-sm sm:grid-cols-3 md:px-0 lg:grid-cols-5 lg:gap-10 xl:gap-20">
          <div className="border-silver/30 col-span-3 w-full border-b lg:hidden" />
          {FOOTER_CATEGORIES.map((category, index) => (
            <Fragment key={index}>
              {index === 1 && (
                <div className="border-b-silver/30 col-span-3 w-full border-b sm:hidden" />
              )}
              <FooterOptionList
                isFirst={index === 0}
                title={category.title}
                options={category.options}
              />
              {index === 2 && (
                <div className="border-b-silver/30 col-span-3 w-full border-b lg:hidden" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="my-6 flex w-full flex-col items-center justify-center gap-5 lg:flex-row-reverse">
        <div className="flex items-center gap-5 px-[2%]">
          {SOCIAL_MEDIA_LINKS.map((item) => (
            <Link to={item.url} key={item.id} target="_blank" className="cursor-pointer">
              <Icon icon={item.icon} className={`size-5 md:size-6 ${item.className ?? ''}`} />
            </Link>
          ))}
        </div>
        <div className="text-battleship-davys-gray-invert px-[10%] text-center text-sm">
          &copy; {year}&nbsp; Beautinique Pvt. Ltd. All rights reserved. Designed with{' '}
          <span className="text-red-c">♥</span> by&nbsp;
          <GradientText text="Nageshwar Pawar" type="accent" className="font-medium text-nowrap" />.
        </div>
      </div>
    </div>
  );
};

export default Footer;
