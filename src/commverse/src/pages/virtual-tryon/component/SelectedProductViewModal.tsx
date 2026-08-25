import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import type {
  IProductResponse,
  ModalProps,
  PipetteEdition,
} from '../../../types';
import { useMemo } from 'react';
import { getCurrencySymbol, getProductPreviewImage } from '../../../lib/utils';

type Props = {
  product: IProductResponse;
  modalProps: Omit<Partial<ModalProps>, 'open' | 'onClose'> & {
    open: boolean;
    onClose: () => void;
  };
  onBack: () => void;
  onSelectProduct: () => void;
};

const SelectedProductViewModal = ({
  product,
  modalProps,
  onBack,
  onSelectProduct,
}: Props) => {
  const colorVariants = useMemo(() => {
    const colourVariants =
      product?.variants?.filter((v) => v.type === 'colour') ?? [];

    return colourVariants
      .flatMap((v) => v.editions ?? [])
      .filter((e): e is PipetteEdition => e.type === 'pipette')
      .map((e) => ({
        name: e.name,
        hexColor: e.hexColor,
      }));
  }, [product]);

  // const editionVVariants = useMemo(() => {
  //   const colourVariants =
  //     product?.variants?.filter((v) => v.type === 'colour') ?? [];

  //   return colourVariants
  //     .flatMap((v) => v.editions ?? [])
  //     .filter((e): e is PipetteEdition => e.type === 'pipette')
  //     .map((e) => ({
  //       name: e.name,
  //       hexColor: e.hexColor,
  //     }));
  // }, [product]);

  return (
    <Modal
      {...modalProps}
      className={`font-metropolis w-full [&>div]:max-w-260 ${modalProps.className}`}
    >
      <div className="bg-auth-img flex h-137.5 w-full flex-col items-center justify-center gap-5 p-10">
        <div className="border-neutral-gray-200 bg-neutral-gray-100 grid h-auto min-h-73.25 w-fit max-w-3xl min-w-183.25 grid-cols-2 overflow-hidden rounded-3xl border shadow-[0_290px_81px_0_rgba(56,75,159,0.00),0_186px_74px_0_rgba(56,75,159,0.01),0_104px_63px_0_rgba(56,75,159,0.05),0_46px_46px_0_rgba(56,75,159,0.09),0_12px_26px_0_rgba(56,75,159,0.10)]">
          <img
            src={getProductPreviewImage(product)}
            alt="Product Image"
            className="h-full w-fit min-w-91.5 object-cover"
          />
          <div className="min-w-0 flex-1 p-6">
            <div className="flex flex-col gap-5">
              <div className="flex min-w-0 flex-col gap-1">
                <div className="text-neutral-gray-900 line-clamp-4 text-base/[19px] font-semibold">
                  {product?.productName}
                </div>
                <div className="text-neutral-gray-600 line-clamp-6 text-[10px]/[13px]">
                  {product?.description}
                </div>
                <div className="text-neutral-gray-600 mt-3 text-[10px]/[13px] font-medium">
                  PRICE
                </div>
                <div className="text-neutral-gray-900 mt-1 flex gap-px text-base/[19px] font-semibold">
                  <span>{getCurrencySymbol(product?.price?.currency)}</span>
                  <span>{product?.price?.amount}</span>
                </div>
              </div>
              {colorVariants?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-neutral-gray-600 text-[10px]/[13px] font-medium">
                    COLOUR VARIANTS
                  </div>
                  <div className="flex max-w-full gap-3 overflow-x-scroll scroll-smooth">
                    {colorVariants?.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex h-12 w-10 shrink-0 flex-col items-center gap-1"
                      >
                        <div
                          className="border-neutral-gray-400 size-5 rounded-full border"
                          style={{ backgroundColor: color.hexColor }}
                        />
                        <p className="text-neutral-gray-900 line-clamp-2 w-full text-center text-[8px]/[10px] wrap-break-word">
                          {color.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 [&>button]:h-10 [&>button]:min-w-37.5">
          <Button
            content="Back"
            variant="tertiary"
            size="sm"
            onClick={onBack}
            leftIcon={
              <Icon icon="solar:arrow-left-linear" className="size-5" />
            }
          />
          <Button
            content="Select Product"
            size="sm"
            onClick={onSelectProduct}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SelectedProductViewModal;
