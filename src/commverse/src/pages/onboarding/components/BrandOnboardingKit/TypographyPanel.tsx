import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import ToastCard from '../../../../components/AlertCards/ToastCard';
import { typographySchema } from '../../../../schema/settings.schema';
import {
  // deepEqual,
  isFontUrl,
  parseGoogleFontUrl,
} from '../../../../lib/utils';
// import { useUpdateBrand } from '../../../../services/auth-service';
import type {
  FlatFont,
  ToastCardProps,
  TypographyFormData,
} from '../../../../types';
import type { OnboardingBrandKitData } from '../../../../types/onboarding';
import Divider from '../../../../components/Divider';

export function TypographyPanel({
  data,
  onChange,
}: {
  data: OnboardingBrandKitData['fonts'];
  onChange: (next: OnboardingBrandKitData['fonts']) => void;
}) {
  // const updateBrandQuery = useUpdateBrand();
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TypographyFormData>({
    resolver: zodResolver(typographySchema),
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [toastCardProps] = useState<ToastCardProps>();
  const [toastId] = useState(0);

  const fontLinks = data;

  // const showToast = (toast: ToastCardProps) => {
  //   setToastCardProps(toast);
  //   setToastId((prev) => prev + 1);
  // };

  const fonts = useMemo<FlatFont[]>(() => {
    return fontLinks.flatMap((link: string) => parseGoogleFontUrl(link));
  }, [fontLinks]);

  const removeFontStylesheet = (href: string) => {
    document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
      if (el.getAttribute('href') === href) {
        el.remove();
      }
    });
  };

  const handleRemoveFontLink = useCallback(
    (linkIndex: number) => {
      const href = fontLinks[linkIndex];
      if (href) {
        removeFontStylesheet(href);
      }
      onChange(fontLinks.filter((_, i) => i !== linkIndex));
    },
    [fontLinks, onChange]
  );

  const injectFontLink = (url: string) => {
    if (!isFontUrl(url)) return;
    if (document.querySelector(`link[href="${url}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  };

  const handleModalClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmitLink = (formData: TypographyFormData) => {
    const parsedFonts = parseGoogleFontUrl(formData.link);

    const existingKeys = new Set(
      fonts.map((f) => `${f.name.toLowerCase()}-${f.weight}-${f.style}`)
    );

    const duplicate = parsedFonts.find((font) =>
      existingKeys.has(
        `${font.name.toLowerCase()}-${font.weight}-${font.style}`
      )
    );

    if (duplicate) {
      setError('link', {
        type: 'manual',
        message: `${duplicate.name} ${duplicate.weight} ${duplicate.style} already exists`,
      });
      return;
    }

    clearErrors('link');
    injectFontLink(formData.link);
    onChange([...fontLinks, formData.link]);
    handleModalClose();
  };

  // const onSave = useCallback(() => {
  //   if (deepEqual(data, fontLinks)) {
  //     showToast({
  //       type: 'warning',
  //       title: 'No changes found!',
  //       description: 'Please make some changes',
  //     });
  //     return;
  //   }

  //   const formDataToSave = new FormData();
  //   formDataToSave.append(
  //     'kit',
  //     JSON.stringify({
  //       fonts: fontLinks,
  //     })
  //   );

  //   updateBrandQuery.mutate(formDataToSave, {
  //     onSuccess: () => {
  //       onChange(fontLinks);
  //       setAddedFontLinks([]);
  //       showToast({
  //         type: 'success',
  //         title: 'Typography updated',
  //       });
  //     },
  //     onError: (error) => {
  //       showToast({
  //         type: 'error',
  //         title: 'Unable to update!',
  //         description: error.message,
  //       });
  //     },
  //   });
  // }, [data, fontLinks, onChange, updateBrandQuery]);

  // const onCancel = useCallback(() => {
  //   setAddedFontLinks([]);
  // }, []);

  useEffect(() => {
    fontLinks.forEach((link: string) => injectFontLink(link));
  }, [fontLinks]);

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden leading-[18px] font-medium">
      <div className="flex items-center justify-between">
        <div className="text-xs">Typography</div>
        <Button
          variant="tertiary"
          content="Add"
          size="sm"
          className="h-8! w-min"
          onClick={() => {
            clearErrors('link');
            setIsOpen(true);
          }}
        />
      </div>
      <div className="flex grow flex-col gap-3 overflow-y-scroll">
        {fontLinks.map((link, linkIndex) => {
          const faces = parseGoogleFontUrl(link);
          if (faces.length === 0) return null;

          return (
            <Fragment key={link}>
              <div className="border-neutral-gray-400 bg-neutral-gray-200 relative flex flex-col gap-6 rounded-3xl border p-12 backdrop-blur-[2px]">
                <button
                  type="button"
                  aria-label="Remove font"
                  className="border-neutral-gray-200 absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-white text-neutral-gray-700 shadow-sm transition-colors hover:bg-neutral-gray-100 hover:text-neutral-gray-900"
                  onClick={() => handleRemoveFontLink(linkIndex)}
                >
                  <Icon icon="lucide:x" className="size-4" aria-hidden />
                </button>
                {faces.map((font, faceIndex) => (
                  <Fragment
                    key={`${font.name}-${font.weight}-${font.style}-${faceIndex}`}
                  >
                    {faceIndex > 0 && (
                      <Divider className="border-t-neutral-gray-300! border-transparent!" />
                    )}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5 pr-10 text-black">
                        <div className="text-xl leading-6 font-bold">
                          {font.name}
                        </div>
                        <div className="text-sm leading-[18px] font-medium">
                          Weight: {font.weight}
                          {font.style === 'italic' ? ' · Italic' : ''}
                        </div>
                      </div>
                      <div
                        className="flex flex-col gap-4 text-lg"
                        style={{
                          fontFamily: font.name,
                          fontWeight: font.weight,
                          fontStyle: font.style,
                        }}
                      >
                        <div>The quick brown fox jumps over the lazy dog.</div>
                        <div className="flex flex-col">
                          <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
                          <div>abcdefghijklmnopqrstuvwxyz</div>
                          <div>0123456789</div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <Divider className="border-t-neutral-gray-200! border-transparent! last:hidden" />
            </Fragment>
          );
        })}
      </div>

      <Modal
        open={isOpen}
        onClose={handleModalClose}
        className="[&>div]:h-min [&>div]:max-h-none [&>div]:w-[516px]"
      >
        <div className="text-neutral-gray-900 flex h-full w-full flex-col items-center gap-6 p-10">
          <div className="self-start text-2xl leading-7 font-bold">
            Add Font
          </div>
          <Input
            label="Paste Google Font Link"
            type="url"
            placeholder="paste link"
            containerClassName="w-full"
            className="h-10 text-xs!"
            error={errors.link?.message}
            {...register('link')}
          />
          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="secondary"
              content="Cancel"
              size="sm"
              className="h-10!"
              onClick={handleModalClose}
            />
            <Button
              content="Confirm"
              size="sm"
              className="h-10!"
              onClick={handleSubmit(onSubmitLink)}
            />
          </div>
          <a href="https://fonts.google.com/" target="_blank" rel="noreferrer">
            <Button
              variant="link"
              content="Google Fonts"
              size="sm"
              className="text-xs!"
            />
          </a>
        </div>
      </Modal>

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </div>
  );
}
