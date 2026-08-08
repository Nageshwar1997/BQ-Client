import { IMAGE_FORMATS, MAX_IMAGE_SIZE } from '@beautinique/frontend-constants';
import type { TConfirmDetailsZodSchema } from '@beautinique/frontend-types';
import { confirmDetailsZodSchema } from '@beautinique/frontend-zod';
import { formatFileSize } from '@beautinique/shared-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { HighlightNote, StaticPageHeader } from '@/components/layout/static-page';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Stepper from '@/components/ui/Stepper';
import { SELLER_FORM_ID_MAP, SELLER_ONBOARDING_STEPS } from '@/constants/form.constants';
import type { TSellerStepNumber } from '@/types/common.type';

import {
  sellerAddressZodSchema,
  sellerBankDetailsZodSchema,
  sellerBusinessDetailsZodSchema,
  sellerDocumentsFormZodSchema,
  type TSellerAddressZodSchema,
  type TSellerBankDetailsZodSchema,
  type TSellerBusinessDetailsZodSchema,
  type TSellerDocumentsFormZodSchema,
} from '../misc/become-seller/schema/seller.schema';
import AddressStep from '../misc/become-seller/steps/AddressStep';
import BankDetailsStep from '../misc/become-seller/steps/BankDetailsStep';
import BusinessDetailsStep from '../misc/become-seller/steps/BusinessDetailsStep';
import DocumentsStep from '../misc/become-seller/steps/DocumentsStep';
import ReviewStep from '../misc/become-seller/steps/ReviewStep';

const BecomeSeller = () => {
  const [activeStep, setActiveStep] = useState<TSellerStepNumber>(0);

  const businessForm = useForm<TSellerBusinessDetailsZodSchema>({
    resolver: zodResolver(sellerBusinessDetailsZodSchema),
    defaultValues: { step: SELLER_FORM_ID_MAP[0] },
  });

  const bankForm = useForm<TSellerBankDetailsZodSchema>({
    resolver: zodResolver(sellerBankDetailsZodSchema),
    defaultValues: { step: SELLER_FORM_ID_MAP[1] },
  });

  const addressForm = useForm<TSellerAddressZodSchema>({
    resolver: zodResolver(sellerAddressZodSchema),
    defaultValues: { step: SELLER_FORM_ID_MAP[2] },
  });

  const documentsForm = useForm<TSellerDocumentsFormZodSchema>({
    resolver: zodResolver(sellerDocumentsFormZodSchema),
    defaultValues: { step: SELLER_FORM_ID_MAP[3] },
  });

  const reviewForm = useForm<TConfirmDetailsZodSchema>({
    resolver: zodResolver(confirmDetailsZodSchema),
  });

  const handleBusinessDetailsSubmit = (data: TSellerBusinessDetailsZodSchema) => {
    console.log('🚀 ~ handleBusinessDetailsSubmit ~ data:', data);
    setActiveStep(1);
  };

  const handleBankDetailsSubmit = (data: TSellerBankDetailsZodSchema) => {
    console.log('🚀 ~ handleBankDetailsSubmit ~ data:', data);
    setActiveStep(2);
  };

  const handleAddressSubmit = (data: TSellerAddressZodSchema) => {
    console.log('🚀 ~ handleAddressSubmit ~ data:', data);
    setActiveStep(3);
  };

  const handleDocumentsSubmit = (data: TSellerDocumentsFormZodSchema) => {
    console.log('🚀 ~ handleDocumentsSubmit ~ data:', data);
    setActiveStep(4);
  };

  const handleReviewSubmit = (data: TConfirmDetailsZodSchema) => {
    console.log('🚀 ~ handleReviewSubmit ~ data:', data);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? ((prev - 1) as TSellerStepNumber) : prev));
  };

  const DATA = [
    {
      icon: 'solar:case-round-linear',
      title: 'Business Details',
      description: "Tell us about your business so shoppers know who they're buying from.",
      component: <BusinessDetailsStep form={businessForm} />,
      onSubmit: businessForm.handleSubmit(handleBusinessDetailsSubmit),
      highlight: {
        icon: 'solar:shield-check-linear',
        title: 'Why we ask',
        description:
          'Your GSTIN and PAN help us verify your business and stay compliant with tax regulations — we never share these with anyone outside Beautinique.',
      },
    },
    {
      icon: 'solar:card-linear',
      title: 'Bank & Tax Details',
      description: "We'll use this account to send your payouts, minus applicable fees.",
      component: <BankDetailsStep form={bankForm} />,
      onSubmit: bankForm.handleSubmit(handleBankDetailsSubmit),
      highlight: {
        icon: 'solar:lock-keyhole-linear',
        title: 'Your data is safe',
        description:
          'Bank details are encrypted and used only for processing your payouts — no one else on the platform can see them.',
      },
    },
    {
      icon: 'solar:map-point-linear',
      title: 'Pickup Address',
      description: "This is where we'll collect orders from for shipping to your customers.",
      component: <AddressStep form={addressForm} />,
      onSubmit: addressForm.handleSubmit(handleAddressSubmit),
      highlight: {
        icon: 'solar:delivery-linear',
        title: 'Double-check the pincode',
        description:
          'Courier partners are assigned based on your pincode — an incorrect one can delay pickups once you start selling.',
      },
    },
    {
      icon: 'solar:gallery-linear',
      title: 'Upload Documents',
      description: 'A few documents to verify your identity, business, and bank account.',
      component: <DocumentsStep form={documentsForm} />,
      onSubmit: documentsForm.handleSubmit(handleDocumentsSubmit),
      highlight: {
        icon: 'solar:file-check-linear',
        title: 'Accepted formats',
        description: `${IMAGE_FORMATS.join(', ')}, up to ${formatFileSize(MAX_IMAGE_SIZE)} each. Make sure text and details are clearly readable — blurry uploads can delay verification.`,
      },
    },
    {
      icon: 'solar:check-circle-linear',
      title: 'Review & Submit',
      description:
        'Take a moment to check everything below — you can go back and fix anything before submitting.',
      component: (
        <ReviewStep
          form={reviewForm}
          values={{
            business: businessForm.getValues(),
            address: addressForm.getValues(),
            bank: bankForm.getValues(),
            documents: documentsForm.getValues(),
          }}
          disabled={false}
        />
      ),
      onSubmit: reviewForm.handleSubmit(handleReviewSubmit),
      highlight: { icon: null, title: null, description: null },
    },
  ] as const;

  return (
    <div className="mx-auto flex w-full flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <StaticPageHeader
        icon="solar:shop-2-linear"
        title="Become a Seller"
        description="Join the Beautinique marketplace — complete these five quick steps to start selling to our community of beauty shoppers."
      />

      <Stepper
        steps={SELLER_ONBOARDING_STEPS}
        activeStep={activeStep}
        onStepClick={(step) => {
          setActiveStep(step as TSellerStepNumber);
        }}
      >
        <form
          id={SELLER_FORM_ID_MAP[activeStep]}
          onSubmit={DATA[activeStep].onSubmit}
          className="flex flex-col gap-6"
        >
          <div className="border-primary/10 flex items-start gap-3 border-b pb-5">
            <span className="bg-accent-duo flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11">
              <Icon icon={DATA[activeStep].icon} className="size-5 text-white sm:size-5.5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <GradientText
                type="accent"
                text={DATA[activeStep].title}
                className="text-lg font-semibold sm:text-xl"
              />
              <p className="text-secondary text-xs sm:text-sm">{DATA[activeStep].description}</p>
            </div>
          </div>
          {DATA[activeStep].component}
          {!!DATA[activeStep].highlight.icon && (
            <HighlightNote
              icon={DATA[activeStep].highlight.icon}
              title={DATA[activeStep].highlight.title}
            >
              {DATA[activeStep].highlight.description}
            </HighlightNote>
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
              content={activeStep === 4 ? 'Submit' : 'Save'}
            />
          </div>
        </form>
      </Stepper>
    </div>
  );
};

export default BecomeSeller;
