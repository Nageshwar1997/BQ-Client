import { Controller, type UseFormReturn } from 'react-hook-form';

import FileInput from '@/components/ui/inputs/FileInput';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import { SELLER_DOCUMENTS_INPUT_MAP_DATA } from '@/constants/input.constants';

import type { TSellerDocumentsFormZodSchema } from '../schema/seller.schema';

interface IDocumentsStepProps {
  form: UseFormReturn<TSellerDocumentsFormZodSchema>;
  disabled?: boolean;
}

const DocumentsStep = ({ form, disabled = false }: IDocumentsStepProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      {SELLER_DOCUMENTS_INPUT_MAP_DATA.map((input) =>
        input.type === 'file' ? (
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
        ) : input.type === 'select' ? (
          <Controller
            key={input.name}
            control={control}
            name={input.name}
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  label={input.label}
                  selectProps={{
                    value,
                    onChange,
                    placeholder: input.placeholder,
                    disabled,
                  }}
                  options={input.options}
                  error={errors[input.name]?.message}
                  containerClassName="sm:col-span-3"
                />
              );
            }}
          />
        ) : (
          <Input
            key={input.name}
            label={input.label}
            inputProps={{
              name: input.name,
              placeholder: input.placeholder,
              disabled,
              type: input.type,
              autoComplete: input.autoComplete,
            }}
            register={register(input.name)}
            error={errors[input.name]?.message}
            containerClassName="sm:col-span-3"
          />
        ),
      )}
    </div>
  );
};

export default DocumentsStep;
