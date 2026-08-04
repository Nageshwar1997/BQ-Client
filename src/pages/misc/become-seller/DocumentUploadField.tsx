import { Icon } from '@iconify/react';
import type { ChangeEvent } from 'react';

import { InputError, InputLabel } from '@/components/ui/inputs/children';

const ALLOWED_ACCEPT = 'image/jpeg,image/png,application/pdf';

interface IDocumentUploadFieldProps {
  label: string;
  name: string;
  value?: File | string;
  onChange: (value?: File) => void;
  disabled?: boolean;
  error?: string;
}

// A rectangular, labelled single-file dropzone for a KYC document — the same visual language as
// Input.tsx (floating InputLabel + bordered box), but for a `File` value instead of text, since
// each seller document is its own required field rather than an interchangeable gallery (unlike
// the multi-file FileInput carousel used for product media).
const DocumentUploadField = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  error,
}: IDocumentUploadFieldProps) => {
  const fileName =
    value instanceof File
      ? value.name
      : typeof value === 'string'
        ? value.split('/').pop()
        : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(event.target.files?.[0]);
    event.target.value = '';
  };

  return (
    <div className="flex max-w-full min-w-0 flex-col gap-1.5">
      <div className="relative">
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <label
          htmlFor={name}
          className={`border-primary/10 bg-smoke-eerie flex items-center gap-3 overflow-hidden rounded-lg border px-3 py-2 xl:py-3 ${
            disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
          }`}
        >
          <Icon icon="solar:upload-linear" className="text-primary/60 size-4.5 shrink-0" />
          <span
            className={`flex-1 truncate text-[13px] ${fileName ? 'text-primary' : 'text-primary/30'}`}
          >
            {fileName ?? 'Choose a JPG, PNG or PDF (max 5MB)'}
          </span>
          <input
            id={name}
            name={name}
            type="file"
            accept={ALLOWED_ACCEPT}
            disabled={disabled}
            className="sr-only"
            onChange={handleChange}
          />
        </label>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default DocumentUploadField;
