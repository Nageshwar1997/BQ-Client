import { useEffect, useMemo, useState } from 'react';
import Button from '../../../components/Button';
import type { ProductPreviewCardProps } from '../../../types';

type ProductImageSelectionCardProps = {
  images: string[];
  productName: string;
  description?: string;
  price?: string;
  onNext?: (selectedImage: string) => void;
  compact?: boolean;
};

const ProductPreviewCard = ({
  image,
  productName,
  description,
  price,
  compact = false,
}: ProductPreviewCardProps) => (
  <div
    className={`border-neutral-gray-200 font-metropolis overflow-hidden rounded-[24px] border bg-white ${
      compact
        ? 'w-[220px]'
        : 'w-full max-w-[320px] shadow-[0_290px_81px_0_rgba(56,75,159,0),0_186px_74px_0_rgba(56,75,159,0.01),0_104px_63px_0_rgba(56,75,159,0.05),0_46px_46px_0_rgba(56,75,159,0.09),0_12px_26px_0_rgba(56,75,159,0.10)]'
    }`}
  >
    <div
      className={`bg-white ${
        compact
          ? 'flex aspect-square items-center justify-center p-4'
          : 'h-[270px]'
      }`}
    >
      {image ? (
        <img
          src={image}
          alt={productName}
          className={`h-full w-full object-cover`}
        />
      ) : (
        <div className="text-neutral-gray-600 flex h-full w-full items-center justify-center text-sm">
          Product image unavailable
        </div>
      )}
    </div>

    <div className={compact ? 'p-4' : 'p-6'}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-gray-900 line-clamp-3 text-base/[19px] font-semibold">
            {productName}
          </h3>
          {description ? (
            <p
              className={`text-neutral-gray-600 text-[10px]/[13px] ${
                compact ? 'line-clamp-3' : 'line-clamp-4'
              }`}
            >
              {description}
            </p>
          ) : null}
        </div>

        {price && (
          <div className="flex flex-col gap-1">
            <p className="text-neutral-gray-600 text-[10px]/[13px] font-medium tracking-[0.02em] uppercase">
              Price
            </p>
            <p className="text-neutral-gray-900 text-base/[19px] font-semibold">
              {price || '—'}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ProductImageSelectionCard = ({
  images,
  productName,
  description = '',
  price = '',
  onNext,
  compact = false,
}: ProductImageSelectionCardProps) => {
  const thumbnails = useMemo(
    () =>
      images.filter(
        (image, index, list) =>
          image?.trim().length > 0 && list.indexOf(image) === index
      ),
    [images]
  );

  const [selectedImage, setSelectedImage] = useState<string>(
    thumbnails[0] ?? ''
  );

  useEffect(() => {
    setSelectedImage((current) =>
      current && thumbnails.includes(current) ? current : (thumbnails[0] ?? '')
    );
  }, [thumbnails]);

  const resolvedProductName = productName.trim() || 'Selected product';
  const isCompactSelector = compact && typeof onNext === 'function';

  if (compact) {
    return (
      <ProductPreviewCard
        image={selectedImage}
        productName={resolvedProductName}
        description={description}
        price={price}
        compact
      />
    );
  }

  if (isCompactSelector) {
    return (
      <div className="border-neutral-gray-300 font-metropolis flex w-full max-w-[420px] flex-col gap-4 rounded-[24px] border bg-white p-4 shadow-[0_18px_50px_rgba(24,24,26,0.08)]">
        <div className="flex justify-center">
          <ProductPreviewCard
            image={selectedImage}
            productName={resolvedProductName}
            description={description}
            price={price}
            compact
          />
        </div>

        {thumbnails.length > 1 ? (
          <div className="grid grid-cols-2 gap-3">
            {thumbnails.map((image, index) => {
              const isSelected = image === selectedImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Select product image ${index + 1}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedImage(image)}
                  className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-2 transition ${
                    isSelected
                      ? 'border-neutral-gray-900 shadow-[0_10px_26px_rgba(24,24,26,0.08)]'
                      : 'border-neutral-gray-300 hover:border-neutral-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${resolvedProductName} option ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        ) : null}

        <Button
          content="Next"
          type="button"
          size="sm"
          onClick={() => onNext?.(selectedImage)}
          disabled={!selectedImage}
          className="h-[38px]! rounded-[8px]! px-4! py-[10px]! text-sm/[17.5px]! disabled:opacity-40"
        />
      </div>
    );
  }

  return (
    <div className="border-neutral-gray-300 font-metropolis grid w-full overflow-hidden rounded-3xl border bg-white lg:min-h-135 lg:grid-cols-[minmax(0,1fr)_1fr]">
      <div className="bg-auth-img flex items-center justify-center px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <ProductPreviewCard
          image={selectedImage}
          productName={resolvedProductName}
          description={description}
          price={price}
        />
      </div>

      <div className="flex h-full min-h-0 flex-col gap-6 px-6 pt-6 sm:px-8 sm:pt-8 lg:gap-6 lg:px-8 lg:pt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-neutral-gray-900 text-2xl/[29px] font-bold">
            Select product Image
          </h2>

          {onNext ? (
            <Button
              content="Next"
              type="button"
              size="sm"
              onClick={() => onNext(selectedImage)}
              disabled={!selectedImage}
              className="h-9.5! w-fit! rounded-lg! px-4! py-2.5! text-sm/[17.5px]! disabled:opacity-40"
            />
          ) : null}
        </div>

        {thumbnails.length > 0 ? (
          <div className="no-scrollbar grid max-h-[57dvh] min-h-0 flex-1 grid-cols-2 content-start gap-4 overflow-y-auto last:pb-4 sm:pr-1">
            {thumbnails.map((image, index) => {
              const isSelected = image === selectedImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Select product image ${index + 1}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedImage(image)}
                  className={`flex h-35 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 bg-white transition sm:h-40 lg:h-45 ${
                    isSelected
                      ? 'border-neutral-gray-900 shadow-[0_10px_26px_rgba(24,24,26,0.08)]'
                      : 'hover:border-neutral-gray-300 border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${resolvedProductName} option ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="border-neutral-gray-300 text-neutral-gray-600 flex min-h-60 items-center justify-center rounded-xl border border-dashed bg-white px-6 text-center text-sm">
            We couldn&apos;t find any product images for this item yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageSelectionCard;
