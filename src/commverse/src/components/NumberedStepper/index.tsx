import { Icon } from '@iconify/react';
import { useEffect, useState, type FC } from 'react';
import { Fragment } from 'react/jsx-runtime';

interface NumberedStepperProps {
  initialStep?: number;
  totalSteps: number;
  className?: string;
  onChange?: (currentStep: number) => void;
}

const getValidatedTotalSteps = (steps: number) => {
  if (!Number.isFinite(steps)) return 1;
  return Math.max(1, Math.floor(steps));
};

const getValidatedInitialStep = (step: number | undefined, steps: number) => {
  if (typeof step !== 'number' || !Number.isFinite(step)) return 1;
  return Math.min(Math.max(1, Math.floor(step)), steps);
};

const getValidatedCurrentStep = (step: number, steps: number) => {
  if (!Number.isFinite(step)) return 1;
  return Math.min(Math.max(1, Math.floor(step)), steps);
};

const NumberedStepper: FC<NumberedStepperProps> = ({
  initialStep,
  totalSteps,
  className,
  onChange,
}) => {
  const validatedTotalSteps = getValidatedTotalSteps(totalSteps);
  const [currentStep, setCurrentStep] = useState<number>(() =>
    getValidatedInitialStep(initialStep, validatedTotalSteps)
  );

  useEffect(() => {
    setCurrentStep(getValidatedInitialStep(initialStep, validatedTotalSteps));
  }, [initialStep, validatedTotalSteps]);

  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: validatedTotalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isCurrent = currentStep === stepNumber;
        const isPreviousStep = currentStep - 1 === stepNumber;
        const isStepClickable = isPreviousStep;

        return (
          <Fragment key={stepNumber}>
            <div
              className={`flex h-8 flex-col items-center gap-2 p-0.5 transition-[width] duration-300 ease-out ${isStepClickable ? 'cursor-pointer' : 'cursor-default'} ${!isCurrent ? 'w-8' : 'w-16.75'}`}
              onClick={() => {
                if (!isStepClickable) return;
                const nextStep = getValidatedCurrentStep(
                  stepNumber,
                  validatedTotalSteps
                );
                setCurrentStep(nextStep);
                onChange?.(nextStep);
              }}
            >
              <div
                className={`group relative flex h-full w-full items-center justify-center text-sm font-medium transition-all duration-300 ease-out ${
                  isCompleted
                    ? 'bg-neutral-gray-700 active:bg-neutral-gray-900 text-neutral-gray-900 hover:text-neutral-gray-100 rounded-full'
                    : isCurrent
                      ? 'bg-brand hover:bg-brand-hover active:bg-brand-pressed text-neutral-gray-100 rounded-[20px]'
                      : 'border-neutral-gray-500 text-neutral-gray-900 bg-neutral-gray-200 hover:bg-neutral-gray-300 active:bg-neutral-gray-400 rounded-full border-[1.75px]'
                }`}
              >
                <Icon
                  width={40}
                  icon="solar:check-circle-outline"
                  className={`absolute inset-0 h-full w-full transition-all duration-200 ease-out [&>path:last-child]:hidden text-neutral-100${
                    isCompleted
                      ? 'scale-100 text-white opacity-100 group-hover:scale-75 group-hover:opacity-0 group-active:scale-75 group-active:opacity-0'
                      : 'scale-75 opacity-0'
                  }`}
                />

                <span
                  className={`absolute inset-0 flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-out ${
                    isCurrent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                >
                  STEP {stepNumber}
                </span>

                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out ${
                    isCompleted
                      ? 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100'
                      : isCurrent
                        ? 'scale-75 opacity-0'
                        : 'scale-100 opacity-100'
                  }`}
                >
                  {stepNumber}
                </span>
              </div>
            </div>

            {index < validatedTotalSteps - 1 && (
              <div className="bg-neutral-gray-500! h-px w-2 shrink-0 transition-colors duration-300 ease-out" />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default NumberedStepper;
