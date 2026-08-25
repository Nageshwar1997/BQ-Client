import React from 'react';
import ComverseLogo from '/assets/icons/Commverse Logo - Final.svg';
import { Icon } from '@iconify/react';
import type { LoaderProps } from '../../types';
import { loaderScreenData } from '../../data';

const Loader: React.FC<LoaderProps> = ({
  section = 'versa-ai',
  className = '',
}) => {
  const isHome = section === 'home';
  const isVersaAI = section === 'versa-ai';

  const loaderConfig = loaderScreenData?.find(
    (item) => item?.variant === section
  );

  const { title, icon, className: configClassName } = loaderConfig || {};

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isHome ? 'bg-neutral-gray-100' : configClassName} ${className}`}
    >
      {isVersaAI && (
        <img
          src="/assets/icons/ctruh-gradient-light-two.svg"
          alt="Comverse Studio"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="flex flex-col items-center gap-8 text-center">
        {isHome ? (
          <img
            src={ComverseLogo}
            alt="Comverse Studio"
            className="h-full w-full object-cover px-4"
          />
        ) : (
          <div className={`flex items-center gap-2`}>
            {typeof icon === 'string' ? (
              <Icon icon={icon} className="size-9" />
            ) : (
              icon
            )}
            {title && (
              <h2 className="font-metropolis text-[32px] leading-12 font-medium">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="bg-neutral-gray-400 relative h-2 w-60 overflow-hidden rounded-full">
          <div
            className={`${isHome ? 'bg-brand' : 'bg-neutral-gray-900'} absolute h-full w-18 animate-[slideLoader_1.5s_ease-in-out_infinite] rounded-full`}
          />
        </div>

        {!isHome && (
          <img
            src={ComverseLogo}
            alt="Comverse Studio"
            className="absolute bottom-0 h-auto w-full max-w-40 object-cover px-4 pb-14.25"
          />
        )}
      </div>
    </div>
  );
};

export default Loader;
