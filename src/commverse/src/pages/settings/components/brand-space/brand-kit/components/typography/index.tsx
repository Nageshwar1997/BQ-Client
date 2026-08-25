import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import Button from '../../../../../../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterSettingsHeaderActions } from '../../../../../../../hooks/useRegisterSettingsHeaderActions';
import {
  isFontUrl,
  parseGoogleFontUrl,
} from '../../../../../../../lib/utils';
import type {
  FlatFont,
  TypographyFormData,
} from '../../../../../../../types';
import { typographySchema } from '../../../../../../../schema/settings.schema';
import Modal from '../../../../../../../components/Modal';
import Input from '../../../../../../../components/Input';
import { Link, useOutletContext } from 'react-router';
import type { BrandKitContext } from '../../index';


const Typography = () => {
  const { draftKit, updateDraftKit, isUpdating, onSave, onCancel } =
    useOutletContext<BrandKitContext>();

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
  const [currentFontLinks, setCurrentFontLinks] = useState<string[]>(
    draftKit?.fonts || []
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync draftKit to local state once it loads
  useEffect(() => {
    if (draftKit?.fonts && !isInitialized) {
      setTimeout(() => {
        setCurrentFontLinks(draftKit.fonts || []);
        setIsInitialized(true);
      }, 0);
    }
  }, [draftKit?.fonts, isInitialized]);


  const fonts = useMemo<FlatFont[]>(() => {
    const parsed = currentFontLinks.flatMap((link: string) =>
      parseGoogleFontUrl(link)
    );
    return parsed;
  }, [currentFontLinks]);

  const injectFontLink = (url: string) => {
    if (!isFontUrl(url)) return;
    if (document.querySelector(`link[href="${url}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  };

  const onSubmitLink = (data: TypographyFormData) => {
    const parsedFonts = parseGoogleFontUrl(data.link);

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
    injectFontLink(data.link);
    const nextLinks = [...currentFontLinks, data.link];
    setCurrentFontLinks(nextLinks);
    updateDraftKit({ fonts: nextLinks });
    handleModalClose();
  };

  const handleRemoveFontLink = useCallback(
    (linkIndex: number) => {
      const nextLinks = currentFontLinks.filter((_, i) => i !== linkIndex);
      setCurrentFontLinks(nextLinks);
      updateDraftKit({ fonts: nextLinks });
    },
    [currentFontLinks, updateDraftKit]
  );


  const handleModalClose = () => {
    reset();
    setIsOpen(false);
  };

  useRegisterSettingsHeaderActions(
    useMemo(
      () => ({
        saveBtnProps: {
          onClick: () => onSave(),
          isLoading: isUpdating,
          disabled: isUpdating,
        },
        cancelBtnProps: {
          onClick: () => onCancel(),
          disabled: isUpdating,
        },
      }),
      [onSave, onCancel, isUpdating]
    )
  );

  useEffect(() => {
    currentFontLinks.forEach((link: string) => injectFontLink(link));
  }, [currentFontLinks]);

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
        {currentFontLinks.map((link, linkIndex) => {
          const faces = parseGoogleFontUrl(link);
          if (faces.length === 0) return null;

          return (
            <div key={link} className="flex flex-col gap-3">
              <div
                className="border-neutral-gray-400 bg-neutral-gray-200 relative flex flex-col gap-6 rounded-3xl border p-12 backdrop-blur-[2px]"
              >
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
                      <div className="border-neutral-gray-300 h-px w-full border-t" />
                    )}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5 text-black">
                        <div className="text-xl leading-6 font-bold">{font.name}</div>
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
              <div className="border-neutral-gray-200 h-px w-full border-t last:hidden" />
            </div>
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
          <Link to="https://fonts.google.com/" target="_blank">
            <Button
              variant="link"
              content="Google Fonts"
              size="sm"
              className="text-xs!"
            />
          </Link>
        </div>
      </Modal>

    </div>
  );
};

export default Typography;
