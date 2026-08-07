import type { TConfirmDetailsZodSchema } from '@beautinique/frontend-types';
import { useEffect, useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import GradientText from '@/components/ui/GradientText';
import Checkbox from '@/components/ui/inputs/Checkbox';

import type {
  TSellerAddressZodSchema,
  TSellerBankDetailsZodSchema,
  TSellerBusinessDetailsZodSchema,
  TSellerDocumentsFormZodSchema,
} from '../schema/seller.schema';
import StepIntro from './StepIntro';

interface IReviewStepProps {
  form: UseFormReturn<TConfirmDetailsZodSchema>;
  business: TSellerBusinessDetailsZodSchema;
  bank: TSellerBankDetailsZodSchema;
  address: TSellerAddressZodSchema;
  documents: TSellerDocumentsFormZodSchema;
  disabled?: boolean;
}

const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-center justify-between gap-4 py-1.5 text-[13px]">
    <span className="text-primary/50">{label}</span>
    <span className="text-primary line-clamp-2 max-w-[60%] text-right font-medium">
      {value ?? '—'}
    </span>
  </div>
);

// A freshly-picked file lives in memory as a `File` (needs an object URL to preview); once saved
// it comes back as a plain `string` URL from the server — either way this renders the actual image.
const DocumentPreview = ({ label, value }: { label: string; value?: File | string }) => {
  // Derived directly during render instead of via setState-in-effect (which would trigger an
  // extra cascading render) — a `File` needs an object URL to preview, a saved value is already
  // a plain URL string.
  const previewUrl = useMemo(() => {
    if (value instanceof File) return URL.createObjectURL(value);
    return typeof value === 'string' ? value : undefined;
  }, [value]);

  // Revoking is the actual side effect here (freeing the object URL once it's replaced or this
  // preview unmounts) — the value itself is computed above, not set from within the effect.
  useEffect(() => {
    if (!(value instanceof File) || !previewUrl) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [value, previewUrl]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-primary/50 line-clamp-1 text-[13px]">{label}</span>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={label}
          className="border-primary/10 bg-secondary-invert h-24 w-full rounded-lg border object-cover"
        />
      ) : (
        <div className="border-primary/10 bg-secondary-invert text-primary/40 flex h-24 w-full items-center justify-center rounded-lg border text-xs">
          Not uploaded
        </div>
      )}
    </div>
  );
};

const ReviewStep = ({
  form,
  business,
  bank,
  address,
  documents,
  disabled = false,
}: IReviewStepProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon="solar:check-circle-linear"
        title="Review & Submit"
        description="Take a moment to check everything below — you can go back and fix anything before submitting."
      />

      <div className="border-primary/10 divide-primary/10 divide-y rounded-lg border">
        <div className="p-4">
          <GradientText type="silver" text="Business details" className="text-sm font-semibold" />
          <SummaryRow label="Business name" value={business.businessName} />
          <SummaryRow label="Business type" value={business.businessType} />
          <SummaryRow label="Business email" value={business.businessEmail} />
          <SummaryRow label="Business phone number" value={business.businessPhoneNumber} />
          <SummaryRow label="GSTIN" value={business.gstin} />
          <SummaryRow label="PAN" value={business.pan} />
        </div>
        <div className="p-4">
          <GradientText type="silver" text="Bank & tax details" className="text-sm font-semibold" />
          <SummaryRow label="Account holder" value={bank.accountHolderName} />
          <SummaryRow label="Account number" value={bank.accountNumber} />
          <SummaryRow label="IFSC code" value={bank.ifscCode} />
          <SummaryRow label="Bank name" value={bank.bankName} />
        </div>
        <div className="p-4">
          <GradientText type="silver" text="Address" className="text-sm font-semibold" />
          <SummaryRow
            label="Pickup address"
            value={[address.line1, address.line2].filter(Boolean).join(', ')}
          />
          <SummaryRow label="City / Town" value={address.city} />
          <SummaryRow label="State" value={address.state} />
          <SummaryRow label="Pincode" value={address.pincode} />
          <SummaryRow label="Country" value={address.country} />
        </div>
        <div className="p-4">
          <GradientText type="silver" text="Documents" className="text-sm font-semibold" />
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <DocumentPreview label="ID proof" value={documents.id} />
            <DocumentPreview label="Address proof" value={documents.address} />
            <DocumentPreview label="Business license" value={documents.license} />
            <DocumentPreview label="PAN card" value={documents.pan} />
            <DocumentPreview label="GST certificate" value={documents.gst} />
            <DocumentPreview label="Passbook / Cancelled cheque" value={documents.bank} />
          </div>
        </div>
      </div>

      <Checkbox
        register={register('confirm')}
        checkboxProps={{ name: 'confirm', disabled }}
        content="I confirm the above information is accurate."
        error={errors.confirm?.message}
      />
    </div>
  );
};

export default ReviewStep;
