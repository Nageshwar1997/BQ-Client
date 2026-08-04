import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BorderGradient from '@/components/layout/containers/BorderGradient';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import Stepper from '@/components/ui/Stepper';
import { SELLER_ONBOARDING_STEPS } from '@/constants/common.constants';
import { FORM_DEFAULT_VALUES, SELLER_FORM_ID_MAP } from '@/constants/form.constants';
import {
  sellerBankDetailsZodSchema,
  sellerBusinessDetailsZodSchema,
  sellerDocumentsFormZodSchema,
  sellerReviewZodSchema,
  type TSellerBankDetailsZodSchema,
  type TSellerBusinessDetailsZodSchema,
  type TSellerDocumentsFormZodSchema,
  type TSellerReviewZodSchema,
} from '@/schemas/seller.schema';
import { useUploadSingleMedia } from '@/services/media-service/media.service.query';
import {
  useSaveDraftSellerApplication,
  useSubmitSellerApplication,
} from '@/services/organization-service/seller.service.query';
import type { TApiSellerApplicationBase } from '@/types/api.type';
import { setErrorToForm } from '@/utils/form.util';

import BankDetailsStep from './steps/BankDetailsStep';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import DocumentsStep from './steps/DocumentsStep';
import ReviewStep from './steps/ReviewStep';

type TStep = 0 | 1 | 2 | 3;

interface ISellerOnboardingWizardProps {
  // Prefills the wizard from an in-progress draft, or from a previously rejected application when
  // resubmitting (REJECTED -> PENDING).
  draft?: Partial<TApiSellerApplicationBase> | null;
}

const uploadSellerDocument = async (
  upload: ReturnType<typeof useUploadSingleMedia>,
  file: File,
  label: string,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'SellerDocuments');

  const { data } = await upload.mutateAsync({
    data: formData,
    toasterInfo: { title: 'Please wait...', description: `Uploading ${label}...` },
  });

  return data ?? '';
};

// A resumed draft prefills each document field with the URL a previous upload already returned —
// only re-upload when the user picked a new `File` in this session.
const resolveSellerDocument = (
  upload: ReturnType<typeof useUploadSingleMedia>,
  value: File | string,
  label: string,
) =>
  typeof value === 'string' ? Promise.resolve(value) : uploadSellerDocument(upload, value, label);

const SellerOnboardingWizard = ({ draft }: ISellerOnboardingWizardProps) => {
  /* ================= 1. API/Queries Hooks ================= */
  const saveDraft = useSaveDraftSellerApplication();
  const submitApplication = useSubmitSellerApplication();
  const uploadMedia = useUploadSingleMedia();

  /* ================= 2. Forms ================= */
  const businessForm = useForm<TSellerBusinessDetailsZodSchema>({
    resolver: zodResolver(sellerBusinessDetailsZodSchema),
    defaultValues: {
      ...FORM_DEFAULT_VALUES.sellerBusinessDetails,
      businessName: draft?.businessName ?? FORM_DEFAULT_VALUES.sellerBusinessDetails.businessName,
      businessType: draft?.businessType ?? FORM_DEFAULT_VALUES.sellerBusinessDetails.businessType,
      gstin: draft?.gstin ?? FORM_DEFAULT_VALUES.sellerBusinessDetails.gstin,
      pan: draft?.pan ?? FORM_DEFAULT_VALUES.sellerBusinessDetails.pan,
    },
  });

  const bankForm = useForm<TSellerBankDetailsZodSchema>({
    resolver: zodResolver(sellerBankDetailsZodSchema),
    defaultValues: {
      ...FORM_DEFAULT_VALUES.sellerBankDetails,
      accountHolderName:
        draft?.bankDetails?.accountHolderName ??
        FORM_DEFAULT_VALUES.sellerBankDetails.accountHolderName,
      accountNumber:
        draft?.bankDetails?.accountNumber ?? FORM_DEFAULT_VALUES.sellerBankDetails.accountNumber,
      ifscCode: draft?.bankDetails?.ifscCode ?? FORM_DEFAULT_VALUES.sellerBankDetails.ifscCode,
      bankName: draft?.bankDetails?.bankName ?? FORM_DEFAULT_VALUES.sellerBankDetails.bankName,
    },
  });

  const documentsForm = useForm<TSellerDocumentsFormZodSchema>({
    resolver: zodResolver(sellerDocumentsFormZodSchema),
    defaultValues: {
      pickupAddress: {
        addressLine1: draft?.pickupAddress?.addressLine1 ?? '',
        addressLine2: draft?.pickupAddress?.addressLine2 ?? '',
        city: draft?.pickupAddress?.city ?? '',
        state: draft?.pickupAddress?.state ?? '',
        pincode: draft?.pickupAddress?.pincode ?? '',
        country: draft?.pickupAddress?.country ?? 'India',
      },
      idProof: draft?.documents?.idProof,
      addressProof: draft?.documents?.addressProof,
      businessLicense: draft?.documents?.businessLicense,
    },
  });

  const reviewForm = useForm<TSellerReviewZodSchema>({
    resolver: zodResolver(sellerReviewZodSchema),
    defaultValues: FORM_DEFAULT_VALUES.sellerReview,
  });

  /* ================= 3. Local State ================= */
  const [activeStep, setActiveStep] = useState<TStep>(0);

  /* ================= 4. Derived Values ================= */
  const isSaving = saveDraft.isPending || uploadMedia.isPending;

  /* ================= 5. Handlers ================= */
  const handleBusinessDetailsSubmit = async (data: TSellerBusinessDetailsZodSchema) => {
    await saveDraft.mutateAsync(
      { ...data, step: 0 },
      {
        onSuccess: () => {
          setActiveStep(1);
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(businessForm.setError, fieldErrors);
        },
      },
    );
  };

  const handleBankDetailsSubmit = async (data: TSellerBankDetailsZodSchema) => {
    await saveDraft.mutateAsync(
      { ...data, step: 1 },
      {
        onSuccess: () => {
          setActiveStep(2);
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(bankForm.setError, fieldErrors);
        },
      },
    );
  };

  const handleDocumentsSubmit = async (data: TSellerDocumentsFormZodSchema) => {
    const [idProof, addressProof, businessLicense] = await Promise.all([
      resolveSellerDocument(uploadMedia, data.idProof, 'ID proof'),
      resolveSellerDocument(uploadMedia, data.addressProof, 'address proof'),
      resolveSellerDocument(uploadMedia, data.businessLicense, 'business license'),
    ]);

    await saveDraft.mutateAsync(
      {
        step: 2,
        pickupAddress: data.pickupAddress,
        idProof,
        addressProof,
        businessLicense,
      },
      {
        onSuccess: () => {
          setActiveStep(3);
        },
        onError: ({ fieldErrors }) => {
          setErrorToForm(documentsForm.setError, fieldErrors);
        },
      },
    );
  };

  const handleReviewSubmit = async () => {
    await submitApplication.mutateAsync();
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? ((prev - 1) as TStep) : prev));
  };

  /* ================= 6. JSX ================= */
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
            {activeStep === 0 && <BusinessDetailsStep form={businessForm} disabled={isSaving} />}
            {activeStep === 1 && <BankDetailsStep form={bankForm} disabled={isSaving} />}
            {activeStep === 2 && <DocumentsStep form={documentsForm} disabled={isSaving} />}
            {activeStep === 3 && (
              <ReviewStep
                form={reviewForm}
                business={businessForm.getValues()}
                bank={bankForm.getValues()}
                documents={documentsForm.getValues()}
                disabled={submitApplication.isPending}
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
                buttonProps={{ type: 'submit', disabled: isSaving || submitApplication.isPending }}
                content={activeStep === 3 ? 'Submit for review' : 'Save & continue'}
              />
            </div>
          </form>
        </Stepper>
      </BorderGradient>
    </div>
  );
};

export default SellerOnboardingWizard;
