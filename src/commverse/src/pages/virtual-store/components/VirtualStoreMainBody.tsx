import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { StoreFormType } from '..';
import StepOneMain from '../main/StepOneMain';
import { DynamicInput } from '../../../components/DynamicInput';
import VariantsSelector from '../../../components/VariantsSelector';
import StepTwoMain from '../main/StepTwoMain';
import StepTwoHeader from '../main/StepTwoHeader';
import StepThreeMain from '../main/StepThreeMain';
import StepFourMain from '../main/StepFourMain';
import StepFiveMain from '../main/StepFiveMain';
import StepSixMain from '../main/StepSixMain';
import { useState } from 'react';
import type { ToastCardProps } from '../../../types';
import ToastCard from '../../../components/AlertCards/ToastCard';

const VirtualStoreMainBody = () => {
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastIndex, setToastIndex] = useState<number>(0);

  const { control } = useFormContext<StoreFormType>();

  const step = useWatch({
    control,
    name: 'step',
  });

  const showToast = (toastProps: ToastCardProps) => {
    setToastCardProps(toastProps);
    setToastIndex((prev) => prev + 1);
  };

  return (

    <div className="font-metropolis flex min-h-0 grow flex-col gap-6 overflow-hidden p-8 pt-6 pr-12">
      {/* Header */}
      <div className="flex h-10 w-full justify-between">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <DynamicInput
              className="grow [&>div]:px-0!"
              value={field.value}
              onSubmit={(title) => {
                const newTitle = title.trim();
                field.onChange(newTitle);
              }}
            />
          )}
        />
        {[1, 3].includes(step) ? (
          <VariantsSelector
            title="Variations"
            initialDataIndex={2}
            onSelect={(index) => console.log(index)}
            data={[
              'https://commverse-3d-upload.s3.amazonaws.com/experiences/uploads/69a812802f65739b471f73f6/1773107091568-male1.webp',
              'https://commverse-3d-upload.s3.amazonaws.com/experiences/uploads/69a812802f65739b471f73f6/1773107091569-female1.webp',
              'https://commverse-3d-upload.s3.amazonaws.com/experiences/uploads/69a812802f65739b471f73f6/1773107091569-male2.webp',
              'https://commverse-3d-upload.s3.amazonaws.com/experiences/uploads/69a812802f65739b471f73f6/1773107091568-male1.webp',
            ]}
          />
        ) : step === 2 ? (
          <StepTwoHeader showToast={showToast} />
        ) : (
          <></>
        )}
      </div>

      {/* Content */}
      <div className="flex grow flex-col gap-6 min-h-0">
        {step === 1 ? (
          <StepOneMain />
        ) : step === 2 ? (
          <StepTwoMain />
        ) : step === 3 ? (
          <StepThreeMain />
        ) : step === 4 ? (
          <StepFourMain />
        ) : step === 5 ? (
          <StepFiveMain />
        ) : (
          <StepSixMain />
        )}
      </div>

      {toastCardProps && <ToastCard key={toastIndex} {...toastCardProps} />}
    </div>
  );
};

export default VirtualStoreMainBody;
