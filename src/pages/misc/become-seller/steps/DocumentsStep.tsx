import { FileInput } from '@beautinique/frontend-components/file-input';
import type { TSellerDocumentsZodSchema } from '@beautinique/frontend-types';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { SELLER_DOCUMENTS_INPUT_MAP_DATA } from '@/constants/input.constants';
import { VIDEO_PLAYER_PROPS } from '@/utils/common.util';

interface IDocumentsStepProps {
  form: UseFormReturn<TSellerDocumentsZodSchema>;
  disabled?: boolean;
}

const DocumentsStep = ({ form, disabled = false }: IDocumentsStepProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      {SELLER_DOCUMENTS_INPUT_MAP_DATA.map((input) => (
        <Controller
          key={input.name}
          control={form.control}
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
                  form.formState.errors[input.name]?.message
                    ? [form.formState.errors[input.name]?.message]
                    : undefined
                }
                containerClassName="sm:col-span-2"
                playerProps={VIDEO_PLAYER_PROPS}
              />
            );
          }}
        />
      ))}
    </div>
  );
};

export default DocumentsStep;
