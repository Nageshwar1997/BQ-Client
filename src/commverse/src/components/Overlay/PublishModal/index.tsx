import { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../Button';
import { copyToClipboard } from '../../../lib/utils';

const PublishModal = ({ src }: { src: string }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => setIsOpen(false);

  const publishUrl = src
    ? `https://commversepublish.ctruh.org/3d-visualizer/${src}`
    : 'https://commversepublish.ctruh.org/3d-visualizer/';

  const embedCode = `<iframe src="${publishUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
      onClick={handleClose}
    >
      <div
        className="font-metropolis bg-neutral-gray-100 border-neutral-gray-300 flex h-[80%] max-h-137.5 w-[80%] max-w-260 gap-8 rounded-3xl border p-10 text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-1/2 items-center justify-center rounded-3xl bg-[#eff0f6]">
          <img src={src} alt="" />
        </div>
        <div className="relative h-full w-1/2">
          <div className="mb-8 flex h-[70%] w-full flex-col items-center justify-center">
            <div
              className="absolute top-0 right-0 cursor-pointer p-3"
              onClick={handleClose}
            >
              <Icon
                icon="lucide:x"
                className="text-neutral-gray-900 size-6 cursor-pointer"
              />
            </div>
            <Icon
              icon="solar:check-circle-bold"
              width={96}
              height={96}
              className="text-ui-success mb-4"
            />
            <span className="mb-2 text-[24px] font-bold">
              Published Successfully!
            </span>
            <span className="text-neutral-gray-600 text-[14px]">
              Traditional Tribal Designer Wooden Stool
            </span>
          </div>
          <div className="mb-4 inline-flex w-full gap-3">
            <Button
              className="max-w-full flex-1 justify-start overflow-hidden border-neutral-400! px-3! py-2! text-[12px] font-medium! underline"
              variant="outline"
              leftIcon={
                <Icon icon="solar:link-linear" width={20} height={20} />
              }
              rightIcon={
                <Icon
                  icon="solar:arrow-right-up-linear"
                  width={20}
                  height={20}
                />
              }
              content={publishUrl}
            />
            <Button
              className="w-fit! p-2.5!"
              variant="secondary"
              leftIcon={
                <Icon icon="solar:copy-linear" width={20} height={20} />
              }
              onClick={() => copyToClipboard(publishUrl)}
            />
          </div>
          <div>
            <Button
              variant="tertiary"
              leftIcon={
                <Icon icon="solar:code-linear" width={24} height={24} />
              }
              content="Copy Embedded Code"
              onClick={() => copyToClipboard(embedCode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
