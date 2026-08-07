import { Icon } from '@iconify/react';

import GradientText from '@/components/ui/GradientText';

interface IStepIntro {
  icon: string;
  title: string;
  description: string;
}

// Small in-panel header repeated at the top of every step — gives each step its own context
// instead of dropping the user straight into a bare grid of inputs.
const StepIntro = ({ icon, title, description }: IStepIntro) => (
  <div className="border-primary/10 flex items-start gap-3 border-b pb-5">
    <span className="bg-accent-duo flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11">
      <Icon icon={icon} className="size-5 text-white sm:size-5.5" />
    </span>
    <div className="flex flex-col gap-0.5">
      <GradientText type="accent" text={title} className="text-lg font-semibold sm:text-xl" />
      <p className="text-secondary text-xs sm:text-sm">{description}</p>
    </div>
  </div>
);

export default StepIntro;
