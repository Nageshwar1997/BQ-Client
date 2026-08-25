import { Link } from 'react-router';
import Button from '../../../components/Button';
import NumberedStepper from '../../../components/NumberedStepper';
import { useFormContext, useWatch } from 'react-hook-form';
import { virtualStoreDefaultData, type StoreFormType } from '..';
import StepOne from '../sidebar/StepOne';
import { useState } from 'react';
import StepTwo from '../sidebar/StepTwo';
import StepThree from '../sidebar/StepThree';
import StepFour from '../sidebar/StepFour';
import StepFive from '../sidebar/StepFive';
import StepSix from '../sidebar/StepSix';

export interface StepProps {
  resetSignal?: number;
}

const VirtualStoreSidebar = ({ onSubmit }: { onSubmit: () => void }) => {
  const [resetSignal, setResetSignal] = useState<number>(0);
  const { setValue, control, reset } = useFormContext<StoreFormType>();

  const step = useWatch({
    control,
    name: 'step',
  });

  const handleResetAll = () => {
    reset(virtualStoreDefaultData);
    setResetSignal((prev) => prev + 1);
  };

  return (
    <div className="font-metropolis text-neutral-gray-900 bg-neutral-gray-200 flex h-full w-75 flex-col gap-5 overflow-x-hidden py-5.5">
      <Link to="/dashboard" className="px-4">
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="comm-logo"
          className="h-11 max-w-51"
        />
      </Link>
      <div className="font-metropolis flex grow flex-col gap-4 overflow-hidden px-4 pt-3">
        <div className="text-neutral-gray-900 flex items-center justify-between gap-4">
          <span className="text-base/[19px] font-semibold">
            Virtual Storefront Setup
          </span>
          <Button
            variant="link"
            content="Reset All"
            className="text-xs!"
            onClick={handleResetAll}
          />
        </div>
        <NumberedStepper
          initialStep={step}
          totalSteps={6}
          onChange={(step) => setValue('step', step)}
        />
        <div className="flex grow flex-col gap-4 overflow-y-scroll scroll-smooth">
          {step === 1 ? (
            <StepOne resetSignal={resetSignal} />
          ) : step === 2 ? (
            <StepTwo />
          ) : step === 3 ? (
            <StepThree />
          ) : step === 4 ? (
            <StepFour />
          ) : step === 5 ? (
            <StepFive />
          ) : (
            <StepSix />
          )}
        </div>
      </div>
      <div className="flex h-[38px] min-h-[38px] gap-2 px-4">
        {step !== 1 && (
          <Button
            size="sm"
            variant="outline"
            content="Previous"
            className="w-min!"
            onClick={() => setValue('step', step - 1)}
          />
        )}
        <Button
          size="sm"
          variant="tertiary"
          content="Save & Continue"
          onClick={() => {
            if (step !== 6) {
              setValue('step', step + 1);
            } else {
              onSubmit();
            }
          }}
        />
      </div>
    </div>
  );
};

export default VirtualStoreSidebar;
