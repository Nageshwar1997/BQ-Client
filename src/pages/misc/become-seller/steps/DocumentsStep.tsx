import { Controller, type UseFormReturn } from 'react-hook-form';

import FileInput from '@/components/ui/inputs/FileInput';
import { SELLER_DOCUMENTS_INPUT_MAP_DATA } from '@/constants/input.constants';

import type { TSellerDocumentsFormZodSchema } from '../schema/seller.schema';

interface IDocumentsStepProps {
  form: UseFormReturn<TSellerDocumentsFormZodSchema>;
  disabled?: boolean;
}

const DocumentsStep = ({ form, disabled = false }: IDocumentsStepProps) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      {SELLER_DOCUMENTS_INPUT_MAP_DATA.map((input) => (
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
                errors={errors[input.name]?.message ? [errors[input.name]?.message] : undefined}
                containerClassName="sm:col-span-2"
              />
            );
          }}
        />
      ))}
    </div>
  );
};

export default DocumentsStep;
