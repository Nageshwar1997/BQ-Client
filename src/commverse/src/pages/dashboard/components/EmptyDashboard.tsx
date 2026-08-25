import React from 'react';
import { Icon } from '@iconify/react';
import { ctaCards, modulesData } from '../../../data';
import Button from '../../../components/Button';
import { Versa } from '../../../icons';
import { ModuleCard } from '../../../components/ModuleCard';
import TopHeader from '../../../components/TopHeader';
import { useLocation, useNavigate } from 'react-router';

const EmptyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/home';

  return (
    <div className="flex h-screen flex-col gap-10">
      <TopHeader />

      <div className="flex grow flex-col justify-between gap-8 px-8 pb-12">
        <div>
          <p className="font-metropolis mb-6 w-full text-center text-[32px] font-semibold">
            What would you like to create today?
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6">
            {modulesData.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                moduleClassName="max-w-full!"
              />
            ))}
          </div>
        </div>
        {isHome ? (
          <div className="font-metropolis text-neutral-gray-600 inline-flex items-center justify-center justify-self-end text-center text-sm">
            <span className="">Powered by</span>{' '}
            <img
              src="/assets/icons/versa-ai-logo.svg"
              alt="versa-logo"
              className="ml-1 h-auto max-w-21 object-cover"
            />
          </div>
        ) : (
          <>
            <div className="bg-neutral-gray-200 h-px w-full" />
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              {ctaCards.map((card, index) => (
                <div
                  key={index}
                  className={`border-neutral-gray-300 relative flex flex-col gap-4 overflow-hidden rounded-xl border p-5 ${
                    card.isGradientCard ? '' : 'bg-white'
                  }`}
                  onClick={() => {
                    navigate(card.path);
                  }}
                >
                  {card.isGradientCard && (
                    <img
                      src="/assets/icons/ctruh-gradient-light.svg"
                      alt={card.title}
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                  <div className="flex items-start justify-between">
                    <div className="relative z-10">
                      <h4 className="font-metropolis text-neutral-gray-900 text-base font-semibold">
                        {card.title}
                      </h4>
                      <p className="font-metropolis text-neutral-gray-600 mt-px text-sm font-normal">
                        {card.description}
                      </p>
                    </div>
                    <Icon
                      icon="solar:arrow-right-linear"
                      width={18}
                      className="relative z-10"
                    />
                  </div>

                  <Button
                    variant={card.buttonVariant}
                    content={card.buttonText}
                    leftIcon={
                      card.isGradientCard ? (
                        <Versa className="h-4.5 w-4.5 text-white" />
                      ) : (
                        <Icon icon={card.buttonIcon as string} width={18} />
                      )
                    }
                    className="relative z-10 mt-auto h-auto! w-fit!"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyDashboard;
