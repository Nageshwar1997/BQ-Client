import { IMAGE_FORMATS, MAX_IMAGE_SIZE } from '@beautinique/frontend-constants';
import type {
  TConfirmDetailsZodSchema,
  TDraftSellerDetailsZodSchema,
  TSellerAddressZodSchema,
  TSellerBankDetailsZodSchema,
  TSellerBusinessDetailsZodSchema,
  TSellerDocumentsZodSchema,
} from '@beautinique/frontend-types';
import {
  confirmDetailsZodSchema,
  sellerAddressZodSchema,
  sellerBankDetailsZodSchema,
  sellerBusinessDetailsZodSchema,
  sellerDocumentsZodSchema,
} from '@beautinique/frontend-zod';
import { formatFileSize } from '@beautinique/shared-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';

import LoadingPage from '@/components/layout/loaders/LoadingPage';
import { HighlightNote, StaticPageHeader } from '@/components/layout/static-page';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Stepper from '@/components/ui/Stepper';
import { SELLER_FORM_ID_MAP, SELLER_ONBOARDING_STEPS } from '@/constants/form.constants';
import { ROUTES } from '@/constants/routes.constants';
import { useUploadSingleMedia } from '@/services/media-service/media.service.query';
import {
  useGetDraftSeller,
  useGetMySeller,
  useSaveDraftSeller,
  useSubmitSellerDraft,
} from '@/services/organization-service/seller.service.query';
import type { TSellerStepNumber } from '@/types/common.type';
import { handleApiSuccessToaster } from '@/utils/api.util';

import AddressStep from '../misc/become-seller/steps/AddressStep';
import BankDetailsStep from '../misc/become-seller/steps/BankDetailsStep';
import BusinessDetailsStep from '../misc/become-seller/steps/BusinessDetailsStep';
import DocumentsStep from '../misc/become-seller/steps/DocumentsStep';
import ReviewStep from '../misc/become-seller/steps/ReviewStep';

type TDocumentKey = Exclude<keyof TSellerDocumentsZodSchema, 'step'>;

const BecomeSellerWizard = ({
  initialDraft,
}: {
  initialDraft: TDraftSellerDetailsZodSchema | null;
}) => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<TSellerStepNumber>(0);

  const { mutateAsync: saveDraft, isPending: isSavingDraft } = useSaveDraftSeller();
  const { mutateAsync: submitDraft, isPending: isSubmitting } = useSubmitSellerDraft();
  const { mutateAsync: uploadSingle, isPending: isUploading } = useUploadSingleMedia();

  const isPending = isSavingDraft || isSubmitting || isUploading;

  const businessForm = useForm<TSellerBusinessDetailsZodSchema>({
    resolver: zodResolver(sellerBusinessDetailsZodSchema),
    defaultValues: initialDraft?.businessDetails ?? { step: SELLER_FORM_ID_MAP[0] },
  });

  const bankForm = useForm<TSellerBankDetailsZodSchema>({
    resolver: zodResolver(sellerBankDetailsZodSchema),
    defaultValues: initialDraft?.bankDetails ?? { step: SELLER_FORM_ID_MAP[1] },
  });

  const addressForm = useForm<TSellerAddressZodSchema>({
    resolver: zodResolver(sellerAddressZodSchema),
    defaultValues: initialDraft?.address ?? { step: SELLER_FORM_ID_MAP[2] },
  });

  const documentsForm = useForm<TSellerDocumentsZodSchema>({
    resolver: zodResolver(sellerDocumentsZodSchema),
    defaultValues: initialDraft?.documents ?? { step: SELLER_FORM_ID_MAP[3] },
  });

  const reviewForm = useForm<TConfirmDetailsZodSchema>({
    resolver: zodResolver(confirmDetailsZodSchema),
  });

  const handleBusinessDetailsSubmit = async (data: TSellerBusinessDetailsZodSchema) => {
    await saveDraft(data, {
      onSuccess: () => {
        setActiveStep(1);
      },
    });
  };

  const handleBankDetailsSubmit = async (data: TSellerBankDetailsZodSchema) => {
    await saveDraft(data, {
      onSuccess: () => {
        setActiveStep(2);
      },
    });
  };

  const handleAddressSubmit = async (data: TSellerAddressZodSchema) => {
    await saveDraft(data, {
      onSuccess: () => {
        setActiveStep(3);
      },
    });
  };

  // Each document field holds either a freshly-picked `File` (needs uploading) or an
  // already-uploaded URL `string` (kept as-is - re-uploading it would be wasted work,
  // e.g. when the user comes Back to this step after it already saved once).
  const handleDocumentsSubmit = async (data: TSellerDocumentsZodSchema) => {
    const documentKeys = Object.keys(data).filter((key) => key !== 'step') as TDocumentKey[];

    const uploadedEntries = await Promise.all(
      documentKeys.map(async (key) => {
        const value = data[key];

        if (typeof value === 'string') return [key, value] as const;

        const formData = new FormData();
        formData.append('file', value);
        formData.append('folder', 'SellerDocuments');

        const { data: url } = await uploadSingle({
          data: formData,
          toasterInfo: { description: `Uploading ${key}...` },
        });

        return [key, url ?? ''] as const;
      }),
    );

    const payload: TSellerDocumentsZodSchema = {
      step: 'documents',
      ...Object.fromEntries(uploadedEntries),
    } as TSellerDocumentsZodSchema;

    await saveDraft(payload, {
      onSuccess: () => {
        setActiveStep(4);
      },
    });
  };

  const handleReviewSubmit = async () => {
    await submitDraft(undefined, {
      onSuccess: ({ message }) => {
        handleApiSuccessToaster(message);
        void navigate(`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.SELLER_APPLICATION}`);
      },
    });
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? ((prev - 1) as TSellerStepNumber) : prev));
  };

  const DATA = [
    {
      icon: 'solar:case-round-linear',
      title: 'Business Details',
      description: "Tell us about your business so shoppers know who they're buying from.",
      component: <BusinessDetailsStep form={businessForm} disabled={isPending} />,
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
      component: <BankDetailsStep form={bankForm} disabled={isPending} />,
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
      component: <AddressStep form={addressForm} disabled={isPending} />,
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
      component: <DocumentsStep form={documentsForm} disabled={isPending} />,
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
          disabled={isPending}
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
          if (isPending) return;
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
              buttonProps={{
                type: 'button',
                onClick: handleBack,
                disabled: activeStep === 0 || isPending,
              }}
              content="Back"
            />
            <Button
              pattern="primary"
              buttonProps={{ type: 'submit', disabled: isPending }}
              content={
                activeStep === 4
                  ? isSubmitting
                    ? 'Submitting...'
                    : 'Submit'
                  : isPending
                    ? 'Saving...'
                    : 'Save'
              }
            />
          </div>
        </form>
      </Stepper>
    </div>
  );
};

const BecomeSeller = () => {
  const { data: mySeller, isLoading: isLoadingMySeller } = useGetMySeller();
  const { data: draft, isLoading: isLoadingDraft } = useGetDraftSeller(true);

  if (isLoadingMySeller || isLoadingDraft) {
    return <LoadingPage text="Loading..." />;
  }

  // Already applied (any status) - the wizard can't be reused (unique per user
  // server-side), send them to the status screen instead.
  if (mySeller) {
    return <Navigate to={`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.SELLER_APPLICATION}`} replace />;
  }

  return <BecomeSellerWizard initialDraft={draft ?? null} />;
};

export default BecomeSeller;
