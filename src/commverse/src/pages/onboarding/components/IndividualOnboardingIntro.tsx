import { Icon } from '@iconify/react';
import {
  INDIVIDUAL_ONBOARDING_INTRO_CONTENT,
  INDIVIDUAL_ONBOARDING_INTRO_FEATURE_CARDS,
} from '../onboarding.constants';
import Button from '../../../components/Button';

const IndividualOnboardingIntro = ({
  onNext,
  onSkip,
  isSkipping = false,
}: {
  onNext: () => void;
  onSkip: () => void;
  isSkipping?: boolean;
}) => {
  return (
    <div className="flex flex-1 flex-col items-center gap-12 overflow-hidden px-16 pt-12 pb-24">
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="font-metropolis text-2xl font-bold text-zinc-900">
          {INDIVIDUAL_ONBOARDING_INTRO_CONTENT.eyebrow}
        </p>
        <h1 className="font-metropolis max-w-3xl text-[32px] leading-10 font-bold text-zinc-900">
          {INDIVIDUAL_ONBOARDING_INTRO_CONTENT.title}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-10 overflow-hidden px-16">
        {INDIVIDUAL_ONBOARDING_INTRO_FEATURE_CARDS.map(({ title, img }) => (
          <div
            key={title}
            className="flex max-w-[325px] flex-1 flex-col overflow-hidden rounded-[20px] bg-gray-50 outline-1 -outline-offset-1 outline-gray-100"
          >
            <div className="px-6 pt-6 pb-5">
              <p className="font-metropolis text-xl font-bold text-zinc-900">
                {title}
              </p>
            </div>
            <img
              src={img}
              alt={title}
              className="h-80 w-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={onNext}
          disabled={isSkipping}
          content={INDIVIDUAL_ONBOARDING_INTRO_CONTENT.cta}
          variant="primary"
          rightIcon={
            <Icon icon="solar:arrow-right-linear" className="size-5" />
          }
        />
        <Button
          onClick={onSkip}
          isLoading={isSkipping}
          content={
            isSkipping
              ? 'Skipping...'
              : INDIVIDUAL_ONBOARDING_INTRO_CONTENT.helperText
          }
          variant="ghost"
          className="w-fit! bg-transparent p-0! text-sm font-medium italic [&>div>span]:overflow-visible"
        />
      </div>
    </div>
  );
};

export default IndividualOnboardingIntro;
