import { Icon } from '@iconify/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Canvas3D from '../../../3d/Components/Canvas3D';
import ToastCard from '../../../components/AlertCards/ToastCard';
import Button from '../../../components/Button';
import QRModal from '../../../components/ProductHeader/QRModal';
import { defaultSettings } from '../../../constants';
import { VITE_GATEWAY_BASE_URL } from '../../../env';
import { useBrandAdvertisement } from '../../../services/onboarding-services';
import type { ToastCardProps, TTryOn } from '../../../types';
import BrandFashionTryOnModal from '../components/BrandFashionTryOnModal';
import CosmeticTryOnOnboardingModal from '../components/CosmeticTryOnOnboardingModal';
import LogoHeader from '../components/LogoHeader';
import { SUBCATEGORY_SUGGESTIONS } from '../onboarding.constants';
import {
  getImmersivePipelineRequirements,
  inferGarmentType,
} from '../onboarding.utils';
import { CommverseIconChat } from '../../../icons';

type BrandAdvertisementData = {
  originalImageUrl: string;
  resultUrl: string;
};

type TryOnModalType = 'none' | 'cosmetic' | 'fashion';

type ImmersivePDPProps = {
  bgRemovedImage?: string | null;
  profilePhoto?: string | null;
  vibeDescription?: string | null;
  productUrl?: string | null;
  productImages?: string[] | null;
  productName?: string | null;
  productDescription?: string | null;
  productColors?: string[] | null;
  category?: string | null;
  subCategory: TTryOn;
  fashionTryOnGarmentImage?: string | null;
  brandAdvertisementData?: BrandAdvertisementData | null;
  generatedModelUrl?: string | null;
  generatedThumbnailUrl?: string | null;
  publishedLink?: string | null;
  isActive?: boolean;
  shouldAutoGenerate3D?: boolean;
  onClose?: () => void;
  onCloseCosmeticTryOnModal?: () => void;
  onGoToDashboard?: () => void | Promise<void>;
};

const immersivePdpCanvasSettings = {
  ...defaultSettings,
  shadowIntensity: 0.22,
  shadowSoftness: 0.86,
  zoom: { min: 2.5, max: 9 },
  modelTransform: {
    ...defaultSettings.modelTransform,
    rotationAxis: { x: false, y: true, z: false },
  },
  environment: {
    ...defaultSettings.environment,
    presetName: 'Minimal' as const,
    envBgColor: 'transparent',
    lightIntensity: 0.55,
  },
};

const resolveLogoSrc = (rawLogo?: string | null): string | null => {
  const logo = rawLogo?.trim();
  if (!logo) return null;
  if (/^(https?:)?\/\//i.test(logo) || logo.startsWith('data:')) return logo;

  if (logo.startsWith('/logo?') || logo.startsWith('/onboarding/logo?')) {
    const queryPart = logo.includes('?')
      ? logo.slice(logo.indexOf('?') + 1)
      : '';
    const params = new URLSearchParams(queryPart);
    const directUrl = params.get('url')?.trim();
    if (directUrl && /^(https?:)?\/\//i.test(directUrl)) return directUrl;
  }

  if (!VITE_GATEWAY_BASE_URL) return logo;
  return `${VITE_GATEWAY_BASE_URL}${logo.startsWith('/') ? '' : '/'}${logo}`;
};

const ImmersivePDP = ({
  bgRemovedImage,
  profilePhoto,
  vibeDescription,
  productUrl,
  productImages,
  productName,
  productDescription,
  productColors,
  category,
  subCategory,
  fashionTryOnGarmentImage,
  brandAdvertisementData,
  generatedModelUrl = null,
  generatedThumbnailUrl = null,
  publishedLink = null,
  onCloseCosmeticTryOnModal,
  onGoToDashboard,
}: ImmersivePDPProps) => {
  const navigate = useNavigate();
  const { mutateAsync: generateBrandAdvertisement } = useBrandAdvertisement();
  const [activeTryOnModal, setActiveTryOnModal] =
    useState<TryOnModalType>('none');
  const [generatedAdvertisementData, setGeneratedAdvertisementData] =
    useState<BrandAdvertisementData | null>(null);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastIndex, setToastIndex] = useState(0);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [isDashboardNavigating, setIsDashboardNavigating] = useState(false);
  const advertisementRequestKeyRef = useRef<string | null>(null);

  const showToast = useCallback((toastProps: NonNullable<ToastCardProps>) => {
    setToastCardProps(toastProps);
    setToastIndex((prev) => prev + 1);
  }, []);

  const productPreviewImage =
    bgRemovedImage ??
    productImages?.[0] ??
    productUrl ??
    '/assets/images/try-on/cover/lipstick.png';

  const mergedAdvertisementData =
    brandAdvertisementData ?? generatedAdvertisementData;
  const hasAdvertisementData = Boolean(
    mergedAdvertisementData?.resultUrl ||
    mergedAdvertisementData?.originalImageUrl
  );

  const isFashionTryOnAllowed = useMemo(() => {
    const normalizedCategory = (category ?? '').trim().toLowerCase();
    const normalizedSubCategory = (subCategory ?? '').trim().toLowerCase();
    const fashionSubCategories = SUBCATEGORY_SUGGESTIONS.Fashion.map((item) =>
      item.toLowerCase()
    );

    return (
      normalizedCategory === 'fashion' &&
      fashionSubCategories.includes(normalizedSubCategory)
    );
  }, [category, subCategory]);

  const resolvedFashionTryOnGarmentImage = useMemo(() => {
    const explicitImage = fashionTryOnGarmentImage?.trim();
    if (explicitImage) return explicitImage;

    const firstProductImage = productImages?.[0]?.trim();
    if (firstProductImage) return firstProductImage;

    return '';
  }, [fashionTryOnGarmentImage, productImages]);

  useEffect(() => {
    if (hasAdvertisementData || !productPreviewImage) return;

    const resolvedCategory = category?.trim() || subCategory || 'Beauty';
    const requestKey = `${productPreviewImage}|${resolvedCategory}|${subCategory ?? ''}`;
    if (advertisementRequestKeyRef.current === requestKey) return;
    advertisementRequestKeyRef.current = requestKey;

    let isMounted = true;

    void (async () => {
      try {
        const advertisement = await generateBrandAdvertisement({
          product_image_url: productPreviewImage,
          category: resolvedCategory,
          subCategory: subCategory || undefined,
          product_name: productName ?? undefined,
          description: productDescription ?? vibeDescription ?? undefined,
        });

        if (!isMounted) return;
        if (
          !advertisement.adWithoutBrandMemory &&
          !advertisement.adWithBrandMemory
        ) {
          return;
        }

        setGeneratedAdvertisementData({
          originalImageUrl: advertisement.adWithoutBrandMemory,
          resultUrl: advertisement.adWithBrandMemory,
        });
      } catch {
        // Best-effort enhancement. Keep the existing fallback preview.
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [
    category,
    generateBrandAdvertisement,
    hasAdvertisementData,
    productDescription,
    productName,
    productPreviewImage,
    subCategory,
    vibeDescription,
  ]);

  const description =
    productDescription ??
    vibeDescription ??
    'Explore the product with interactive previews, AR, and try-on.';
  const title = productName ?? 'Immersive Product Preview';

  const immersiveRequirements = useMemo(
    () =>
      getImmersivePipelineRequirements({
        category,
        subCategory,
      }),
    [category, subCategory]
  );

  const hasThreeDPreview = Boolean(generatedModelUrl);
  const brandLogoSrc = resolveLogoSrc(profilePhoto);
  const shouldShowArButton = immersiveRequirements.arExperienceCreated;
  const shouldShowTryOnButton = immersiveRequirements.vtonCreated;
  const shouldShowModelThumbnail = immersiveRequirements.asset3dCreated;

  const thumbnails = useMemo(() => {
    const nextThumbnails = [];

    if (shouldShowModelThumbnail) {
      nextThumbnails.push({
        id: 'model-3d',
        src: generatedThumbnailUrl ?? productPreviewImage,
        alt: '3D product thumbnail',
        objectClass: 'object-contain',
      });
    } else {
      nextThumbnails.push({
        id: 'product',
        src: productPreviewImage,
        alt: 'Product thumbnail',
        objectClass: 'object-contain',
      });
    }

    if (shouldShowTryOnButton) {
      nextThumbnails.push({
        id: 'advertisement',
        src:
          mergedAdvertisementData?.resultUrl ??
          '/assets/images/tryons-exp.webp',
        alt: 'AR try-on thumbnail',
        objectClass: 'object-cover',
      });
    }

    return nextThumbnails;
  }, [
    generatedThumbnailUrl,
    mergedAdvertisementData?.resultUrl,
    productPreviewImage,
    shouldShowModelThumbnail,
    shouldShowTryOnButton,
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const defaultSelectedId =
    hasThreeDPreview && shouldShowModelThumbnail
      ? 'model-3d'
      : (thumbnails[0]?.id ?? 'product');
  const resolvedSelectedId =
    selectedId && thumbnails.some((thumbnail) => thumbnail.id === selectedId)
      ? selectedId
      : defaultSelectedId;

  const selectedThumbnail =
    thumbnails.find((thumb) => thumb.id === resolvedSelectedId) ??
    thumbnails[0];
  const isThreeDModelSelected = resolvedSelectedId === 'model-3d';

  const handleArTryOnClick = () => {
    if (isFashionTryOnAllowed) {
      if (!resolvedFashionTryOnGarmentImage) {
        showToast({
          type: 'error',
          title: 'Garment image missing',
          description:
            'Please select a product image before opening Fashion Try-On.',
        });
        return;
      }

      setActiveTryOnModal('fashion');
      return;
    }

    setActiveTryOnModal('cosmetic');
  };

  return (
    <>
      <div className="relative flex h-full w-full flex-col overflow-y-auto bg-white">
        <div className="relative z-10 flex h-[88px] items-center justify-center bg-linear-to-b from-white from-50% to-transparent px-12 py-5">
          {brandLogoSrc ? (
            <img
              src={brandLogoSrc}
              alt="Brand logo"
              className="h-6 w-auto object-contain"
            />
          ) : (
            <LogoHeader
              className="h-auto justify-center"
              logoClassName="h-[16px] w-auto"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col items-center px-6">
          <div className="mt-8 flex w-full max-w-[824px] flex-col items-center gap-3 text-center">
            <h1 className="font-metropolis text-[24px] leading-[120%] font-bold text-[#18181A]">
              {title}
            </h1>
            <p className="font-metropolis text-sm leading-[150%] text-[#797A80]">
              {description}
            </p>
          </div>

          <div className="mt-9 flex w-full max-w-160 flex-col items-center">
            <div className="h-57.5 w-full md:h-[30dvh]">
              {isThreeDModelSelected ? (
                generatedModelUrl ? (
                  <Canvas3D
                    settings={immersivePdpCanvasSettings}
                    modelUrl={generatedModelUrl}
                    description="Loading 3D model..."
                    presentation="immersive-pdp"
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center gap-2 px-5 text-center">
                      <Icon
                        icon="quill:loading-spin"
                        className="size-5 animate-spin text-[#18181A]"
                      />
                      <p className="font-metropolis text-xs leading-[150%] text-[#797A80]">
                        Preparing 3D preview...
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="relative h-full w-full overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,#FEFEFD_54%,#FFFFFF_100%)]" />
                  <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <img
                      src={
                        selectedThumbnail?.src ??
                        '/assets/images/try-on/models/1.webp'
                      }
                      alt="Product Preview"
                      className={`h-full w-full ${
                        selectedThumbnail?.objectClass ?? 'object-cover'
                      } ${
                        selectedThumbnail?.objectClass === 'object-contain'
                          ? 'p-4 md:p-6'
                          : ''
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col items-center gap-6">
              <div className="flex items-center gap-5">
                {thumbnails.map((thumb) => {
                  const isSelected = thumb.id === resolvedSelectedId;
                  return (
                    <button
                      key={thumb.id}
                      type="button"
                      onClick={() => setSelectedId(thumb.id)}
                      className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[12px] border-[1.5px] bg-white shadow-[0_10px_26px_rgba(24,24,26,0.06)] ${
                        isSelected ? 'border-[#18181A]' : 'border-[#EAEBF1]'
                      }`}
                    >
                      <img
                        src={thumb.src}
                        alt={thumb.alt}
                        className={`h-full w-full rounded-[10px] ${thumb.objectClass} ${
                          thumb.objectClass === 'object-contain' ? 'p-1.5' : ''
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {shouldShowArButton ? (
                  <div className="w-[200px]">
                    <Button
                      leftIcon={<Icon icon="solar:object-scan-linear" />}
                      variant="tertiary"
                      content="View in AR"
                      onClick={() => {
                        if (!publishedLink) {
                          showToast({
                            type: 'error',
                            title: 'AR link unavailable',
                            description:
                              'The AR experience is still being prepared.',
                          });
                          return;
                        }

                        setOpenQrModal(true);
                      }}
                    />
                  </div>
                ) : null}
                {shouldShowTryOnButton ? (
                  <div className="w-[200px]">
                    <Button
                      leftIcon={<Icon icon="solar:face-scan-square-linear" />}
                      variant="outline"
                      content="AR Try-On"
                      onClick={handleArTryOnClick}
                    />

                    <CosmeticTryOnOnboardingModal
                      open={activeTryOnModal === 'cosmetic'}
                      onClose={() => {
                        setActiveTryOnModal('none');
                        onCloseCosmeticTryOnModal?.();
                      }}
                      productTitle={productName ?? 'Beauty Product'}
                      subCategory={subCategory ?? 'Lipstick'}
                      variants={productColors ?? []}
                      onNext={() => {
                        setActiveTryOnModal('none');
                        onCloseCosmeticTryOnModal?.();
                      }}
                    />
                    <BrandFashionTryOnModal
                      open={activeTryOnModal === 'fashion'}
                      onClose={() => setActiveTryOnModal('none')}
                      productName={productName ?? 'Your Product'}
                      garmentImage={resolvedFashionTryOnGarmentImage}
                      garmentType={inferGarmentType(subCategory) ?? 'dress'}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <ToastCard
              buttonProps={{
                content: 'Go to Dashboard',
                variant: 'primary',
                rightIcon: <Icon icon="solar:arrow-right-up-outline" />,
                isLoading: isDashboardNavigating,
                onClick: () => {
                  if (isDashboardNavigating) return;

                  setIsDashboardNavigating(true);
                  void (async () => {
                    try {
                      if (onGoToDashboard) {
                        await onGoToDashboard();
                        return;
                      }

                      navigate('/dashboard');
                    } catch {
                      setIsDashboardNavigating(false);
                    }
                  })();
                },
              }}
              className="border-neutral-gray-400! z-0! font-metropolis bottom-2! left-1/2! w-fit! -translate-x-1/2! transform [&>div]:gap-8!"
              icon={
                <CommverseIconChat
                  className="size-8 shrink-0"
                  aria-hidden="true"
                />
              }
              type="custom"
              isClosable={false}
              autoClose={false}
              title="This is just the beginning!"
              description="Explore 3D, AR, try-ons, and more."
            />
          </div>
        </div>
      </div>

      <QRModal
        open={openQrModal}
        onClose={() => setOpenQrModal(false)}
        link={publishedLink ?? ''}
      />

      {toastCardProps && (
        <ToastCard
          key={toastIndex}
          className="fixed right-8 bottom-8 w-133"
          {...toastCardProps}
        />
      )}
    </>
  );
};

export default ImmersivePDP;
