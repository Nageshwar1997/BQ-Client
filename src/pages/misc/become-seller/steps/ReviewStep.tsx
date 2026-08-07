import type { TConfirmDetailsZodSchema } from '@beautinique/frontend-types';
import type { UseFormReturn } from 'react-hook-form';

import GradientText from '@/components/ui/GradientText';
import Checkbox from '@/components/ui/inputs/Checkbox';

import type {
  TSellerAddressZodSchema,
  TSellerBankDetailsZodSchema,
  TSellerBusinessDetailsZodSchema,
  TSellerDocumentsFormZodSchema,
} from '../schema/seller.schema';

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
    <span className="text-primary max-w-[60%] text-right font-medium line-clamp-2">{value ?? '—'}</span>
  </div>
);

const documentName = (value?: File | string) => {
  if (value instanceof File) return value.name;
  if (typeof value === 'string' && value) return value.split('/').pop();
  return '—';
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
    <div className="flex flex-col gap-5">
      <div className="border-primary/10 divide-primary/10 divide-y rounded-lg border">
        <div className="p-4">
          <GradientText type="silver" text="Business details" className="text-sm font-semibold" />
          <SummaryRow label="Business name" value={business.businessName} />
          <SummaryRow label="Business type" value={business.businessType} />
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
            value={[address.addressLine1, address.city, address.state, address.pincode]
              .filter(Boolean)
              .join(', ')}
          />
          <SummaryRow label="Country" value={address.country} />
        </div>
        <div className="p-4">
          <GradientText type="silver" text="Documents" className="text-sm font-semibold" />
          <SummaryRow label="ID proof" value={documentName(documents.idProof)} />
          <SummaryRow label="Address proof" value={documentName(documents.addressProof)} />
          <SummaryRow label="Business license" value={documentName(documents.businessLicense)} />
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
