import type { TConfirmDetailsZodSchema } from '@beautinique/frontend-types';
import { confirmDetailsZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Stepper from '@/components/ui/Stepper';

import { SELLER_FORM_ID_MAP, SELLER_ONBOARDING_STEPS } from './constants';
import {
  sellerBankDetailsZodSchema,
  sellerBusinessDetailsZodSchema,
  sellerDocumentsFormZodSchema,
  type TSellerBankDetailsZodSchema,
  type TSellerBusinessDetailsZodSchema,
  type TSellerDocumentsFormZodSchema,
} from './schema/seller.schema';
import BankDetailsStep from './steps/BankDetailsStep';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import DocumentsStep from './steps/DocumentsStep';
import ReviewStep from './steps/ReviewStep';
type TStep = 0 | 1 | 2 | 3;

const BecomeSeller = () => {
  const [activeStep, setActiveStep] = useState<TStep>(2);

  const businessForm = useForm<TSellerBusinessDetailsZodSchema>({
    resolver: zodResolver(sellerBusinessDetailsZodSchema),
  });

  const bankForm = useForm<TSellerBankDetailsZodSchema>({
    resolver: zodResolver(sellerBankDetailsZodSchema),
  });

  const documentsForm = useForm<TSellerDocumentsFormZodSchema>({
    resolver: zodResolver(sellerDocumentsFormZodSchema),
  });

  const reviewForm = useForm<TConfirmDetailsZodSchema>({
    resolver: zodResolver(confirmDetailsZodSchema),
  });

  const handleBusinessDetailsSubmit = (data: TSellerBusinessDetailsZodSchema) => {
    console.log('🚀 ~ handleBusinessDetailsSubmit ~ data:', data);
  };

  const handleBankDetailsSubmit = (data: TSellerBankDetailsZodSchema) => {
    console.log('🚀 ~ handleBankDetailsSubmit ~ data:', data);
  };

  const handleDocumentsSubmit = (data: TSellerDocumentsFormZodSchema) => {
    console.log('🚀 ~ handleDocumentsSubmit ~ data:', data);
  };

  const handleReviewSubmit = (data: TConfirmDetailsZodSchema) => {
    console.log('🚀 ~ handleReviewSubmit ~ data:', data);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? ((prev - 1) as TStep) : prev));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <GradientText
        type="accent"
        text="Become a Seller"
        className="text-xl font-semibold sm:text-2xl"
      />

      <BorderGradient className="flex flex-col gap-5 lg:gap-6">
        <Stepper steps={SELLER_ONBOARDING_STEPS} activeStep={activeStep}>
          <form
            id={SELLER_FORM_ID_MAP[activeStep]}
            onSubmit={
              activeStep === 0
                ? businessForm.handleSubmit(handleBusinessDetailsSubmit)
                : activeStep === 1
                  ? bankForm.handleSubmit(handleBankDetailsSubmit)
                  : activeStep === 2
                    ? documentsForm.handleSubmit(handleDocumentsSubmit)
                    : reviewForm.handleSubmit(handleReviewSubmit)
            }
            className="flex flex-col gap-6"
          >
            {activeStep === 0 && <BusinessDetailsStep form={businessForm} />}
            {activeStep === 1 && <BankDetailsStep form={bankForm} />}
            {activeStep === 2 && <DocumentsStep form={documentsForm} />}
            {activeStep === 3 && (
              <ReviewStep
                form={reviewForm}
                business={businessForm.getValues()}
                bank={bankForm.getValues()}
                documents={documentsForm.getValues()}
              />
            )}

            <div className="flex gap-4">
              <Button
                pattern="secondary"
                buttonProps={{ type: 'button', onClick: handleBack, disabled: activeStep === 0 }}
                content="Back"
              />
              <Button
                pattern="primary"
                buttonProps={{ type: 'submit' }}
                content={activeStep === 3 ? 'Submit for review' : 'Save & continue'}
              />
            </div>
          </form>
        </Stepper>
      </BorderGradient>
    </div>
  );
};

export default BecomeSeller;
