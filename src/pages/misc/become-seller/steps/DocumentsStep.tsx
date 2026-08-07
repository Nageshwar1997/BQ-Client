import { Controller, type UseFormReturn } from 'react-hook-form';

import { HighlightNote } from '@/components/layout/static-page';
import FileInput from '@/components/ui/inputs/FileInput';
import { SELLER_DOCUMENTS_INPUT_MAP_DATA } from '@/constants/input.constants';

import type { TSellerDocumentsFormZodSchema } from '../schema/seller.schema';
import StepIntro from './StepIntro';

interface IDocumentsStepProps {
  form: UseFormReturn<TSellerDocumentsFormZodSchema>;
  disabled?: boolean;
}

// Groups the flat SELLER_DOCUMENTS_INPUT_MAP_DATA list into labeled sections, purely for layout —
// keeps a wall of 6 file inputs from reading as an undifferentiated list.
const DOCUMENT_GROUPS = [
  { title: 'Identity & Address', fields: ['id', 'address'] },
  { title: 'Business & Tax', fields: ['license', 'pan', 'gst'] },
  { title: 'Bank Proof', fields: ['bank'] },
] as const;

const DocumentsStep = ({ form, disabled = false }: IDocumentsStepProps) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon="solar:gallery-linear"
        title="Upload Documents"
        description="A few documents to verify your identity, business, and bank account."
      />

      {DOCUMENT_GROUPS.map((group) => {
        const inputs = SELLER_DOCUMENTS_INPUT_MAP_DATA.filter((input) =>
          (group.fields as readonly string[]).includes(input.name),
        );

        return (
          <div key={group.title} className="flex flex-col gap-3">
            <p className="text-primary/70 text-sm font-semibold">{group.title}</p>
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
              {inputs.map((input) => (
                <Controller
                  key={input.name}
                  control={control}
                  name={input.name}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <FileInput
                        fileInputProps={{
                          name: input.name,
                          value,
                          disabled,
                          multiple: false,
                          onChange: ({ target: { files } }) => {
                            onChange(files?.[0]);
                          },
                          placeholder: input.placeholder,
                        }}
                        label={input.label}
                        errors={
                          errors[input.name]?.message ? [errors[input.name]?.message] : undefined
                        }
                        containerClassName="sm:col-span-2"
                      />
                    );
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      <HighlightNote icon="solar:file-check-linear" title="Accepted formats">
        JPG, PNG, or PDF, up to 5 MB each. Make sure text and details are clearly readable — blurry
        uploads can delay verification.
      </HighlightNote>
    </div>
  );
};

export default DocumentsStep;
