import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
} from 'react';
import type { ImageInputProps, ToastCardProps } from '../../../types';
import { IMAGE_FILE_TYPES } from '../../../constants';
import Button from '../../Button';
import ToastCard from '../../AlertCards/ToastCard';
import { Icon } from '@iconify/react';
import { getRawImageUrl } from '../../../utils/utils';

const DEFAULT_USER_IMAGE = '/assets/images/default-user.jpg';

const ImageInput: FC<ImageInputProps> = (props) => {
  const {
    onChange,
    onClose,
    errorText,
    label,
    className,
    previewImage,
    description,
    validTypes = IMAGE_FILE_TYPES,
    variant = 'default',
  } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();

  const displayImageUrl =
    previewUrl ?? (variant === 'default' ? DEFAULT_USER_IMAGE : undefined);

  const containerClassName = [
    'w-full flex flex-col gap-1',
    variant === 'brand-kit'
      ? `border-2 border-dashed ${errorText ? 'border-ui-error' : 'border-neutral-gray-500'} h-[194px] rounded-3xl bg-neutral-gray-150 py-8 px-12 gap-3 items-center justify-center overflow-hidden relative`
      : '',
    className,
  ].join(' ');

  useEffect(() => {
    // Explicit empty-string means parent requests clearing the preview.
    if (previewImage === '') {
      setPreviewUrl(undefined);
      return;
    }

    if (typeof previewImage === 'string') {
      setPreviewUrl(previewImage);
      return;
    }

    // Ignore undefined so local blob preview (after Upload/Change) is preserved.
    if (previewImage === null) {
      setPreviewUrl(undefined);
    }
  }, [previewImage]);

  useEffect(() => {
    if (!previewUrl || !previewUrl.startsWith('blob:')) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const revokeIfBlob = (url?: string) => {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  const getFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.slice(lastDotIndex).toLowerCase() : '';
  };

  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        const fileExtension = getFileExtension(file.name);
        const detectedFileType = file.type || fileExtension;

        // Validate other file types
        if (
          !validTypes.includes(detectedFileType) &&
          !validTypes.includes(fileExtension)
        ) {
          setToastCardProps({
            type: 'error',
            title: 'Invalid file format',
            description: 'Please upload a valid file.',
          });
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        setToastCardProps(undefined);
        revokeIfBlob(previewUrl);

        const blobUrl = URL.createObjectURL(file);
        setPreviewUrl(blobUrl);
        onChange(e.target.files);
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [onChange, validTypes, previewUrl]
  );

  const renderPreview = () => {
    if (!displayImageUrl) return null;

    if (variant === 'default') {
      return (
        <img
          loading="lazy"
          src={getRawImageUrl(displayImageUrl)}
          alt="Default user"
          className="h-[72px] w-[72px] rounded-full object-cover"
        />
      );
    }

    if (variant === 'brand-kit') {
      return (
        <img
          src={displayImageUrl}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
      );
    }

    if (variant === 'general-favicon' && 'baseImage' in props) {
      return (
        <div className="relative">
          <img
            loading="lazy"
            src={props.baseImage}
            alt={props.baseImage}
            className="h-[110px] w-full rounded-sm object-contain"
          />
          <img
            loading="lazy"
            src={displayImageUrl}
            alt={displayImageUrl}
            className="absolute top-[28%] left-1/2 h-6 w-6 -translate-x-[90%] object-contain"
          />
        </div>
      );
    }

    if (variant === 'general-social') {
      return (
        <img
          loading="lazy"
          src={displayImageUrl}
          alt={displayImageUrl}
          className="h-[195px] w-[375px] rounded-xl object-cover"
        />
      );
    }

    return null;
  };

  const renderPlaceholder = () => {
    if (previewUrl) return null;

    if (variant === 'default') {
      return (
        <div className="bg-neutral-gray-200 text-brand flex h-[72px] w-[72px] items-center justify-center rounded-full p-5 text-2xl leading-8 font-medium">
          {description}
        </div>
      );
    }

    if (variant === 'brand-kit') {
      return <div className="text-neutral-gray-600 text-xs">{description}</div>;
    }

    if (variant === 'general-favicon' && 'baseImage' in props) {
      return (
        <img
          src={props.baseImage}
          alt={props.baseImage}
          className="h-[110px] w-full rounded-sm object-contain"
        />
      );
    }

    if (variant === 'general-social') {
      return (
        <div className="bg-neutral-gray-150 text-neutral-gray-600 flex h-[195px] w-[375px] items-center justify-center rounded-xl p-3 text-xs leading-[18px] font-medium">
          Preview
        </div>
      );
    }

    return null;
  };

  const renderActions = () => (
    <div
      className={`z-50 flex gap-4 ${variant === 'general-favicon' || variant === 'general-social' ? 'flex-row-reverse' : ''}`}
    >
      {previewUrl && (
        <Button
          variant="ghost"
          content="Remove"
          size="sm"
          className={`leading-none! ${variant === 'general-social' ? '' : ''}`}
          onClick={() => {
            revokeIfBlob(previewUrl);
            setPreviewUrl(undefined);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onClose();
          }}
        />
      )}
      <Button
        content={previewUrl ? 'Change' : 'Upload'}
        variant="tertiary"
        size={variant === 'brand-kit' ? 'md' : 'sm'}
        className={`leading-none! ${variant === 'brand-kit' ? '' : 'h-8!'}`}
        leftIcon={
          variant === 'brand-kit' && !previewUrl ? (
            <Icon icon="solar:upload-minimalistic-bold" className="h-5! w-5!" />
          ) : undefined
        }
        onClick={() => fileInputRef.current?.click()}
      />
    </div>
  );

  const renderDefaultLayout = () => (
    <Fragment>
      <label htmlFor={label} className="text-xs leading-[18px] font-medium">
        {label}
      </label>
      <div className="flex items-center justify-between">
        {displayImageUrl ? renderPreview() : renderPlaceholder()}
        {renderActions()}
      </div>
    </Fragment>
  );

  const renderBrandKitLayout = () => (
    <Fragment>
      {renderPreview()}
      <div className="flex flex-col items-center gap-1 leading-[18px]">
        <label
          htmlFor={label}
          className="text-neutral-gray-900 text-sm font-medium"
        >
          {label}
        </label>
        <div className="text-neutral-gray-600 text-xs">{description}</div>
      </div>
      {renderActions()}
    </Fragment>
  );

  const renderGeneralFaviconLayout = () => (
    <Fragment>
      {previewUrl ? renderPreview() : renderPlaceholder()}
      <label htmlFor={label} className="text-xs leading-[18px] font-medium">
        {label}
      </label>
      <div className="flex grow items-center justify-between pt-2">
        {renderActions()}
      </div>
    </Fragment>
  );

  const renderGeneralSocialLayout = () => (
    <div className="flex gap-3">
      <div className="flex grow flex-col items-start gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor={label} className="leading-5 font-semibold">
            {label}
          </label>
          <div className="text-neutral-gray-600 text-xs leading-[18px] font-medium">
            {description}
          </div>
        </div>
        {renderActions()}
      </div>
      {previewUrl ? renderPreview() : renderPlaceholder()}
    </div>
  );

  const renderLayout = () => {
    switch (variant) {
      case 'default':
        return renderDefaultLayout();

      case 'brand-kit':
        return renderBrandKitLayout();

      case 'general-favicon':
        return renderGeneralFaviconLayout();

      case 'general-social':
        return renderGeneralSocialLayout();

      default:
        return null;
    }
  };

  return (
    <div className={containerClassName}>
      {renderLayout()}
      <input
        ref={fileInputRef}
        type="file"
        name={label}
        className="hidden"
        accept={validTypes.join(', ')}
        onChange={handleImageChange}
      />

      {errorText && (
        <span
          className={`text-ui-error z-50 flex items-center gap-1 text-xs font-normal ${variant === 'brand-kit' ? '' : 'mt-2'}`}
        >
          <Icon icon="solar:info-circle-outline" className="h-4 min-w-4" />
          {errorText}
        </span>
      )}

      {toastCardProps && <ToastCard {...toastCardProps} />}
    </div>
  );
};

export default ImageInput;
