import { Hook } from '@/Hooks';
import { InfoIcon } from '@/Icons';
import type { IConfirmModal } from '@/Types';
import { ModalWrapper } from './ModalWrapper';
import { Button, GradientText } from '@/Components/UI';

const TopIconLayer = ({ type }: { type: IConfirmModal['type'] }) => (
  <div
    className={`size-8 rounded-full p-0.5 sm:size-10 sm:p-1 md:size-12 md:p-1.5 lg:size-14 lg:p-2 ${
      type === 'success'
        ? 'bg-green-300'
        : type === 'error'
          ? 'bg-red-300'
          : type === 'warning'
            ? 'bg-yellow-300'
            : ''
    }`}
  >
    <div
      className={`size-full rounded-full p-0.5 sm:p-1 md:p-1.5 lg:p-2 ${
        type === 'success'
          ? 'bg-green-400'
          : type === 'error'
            ? 'bg-red-400'
            : type === 'warning'
              ? 'bg-yellow-400'
              : ''
      }`}
    >
      <div
        className={`flex size-full items-center justify-center rounded-full p-0.5 sm:p-1 md:p-1.5 lg:p-2 ${
          type === 'success'
            ? 'bg-green-500'
            : type === 'error'
              ? 'bg-red-500'
              : type === 'warning'
                ? 'bg-yellow-500'
                : ''
        }`}
      >
        <InfoIcon className="size-4 sm:size-5 md:size-6 lg:size-7" />
      </div>
    </div>
  </div>
);
export const InitialNotCloseConfirmModal = ({
  type,
  title,
  children,
  description,
  modalProps,
  buttons,
}: IConfirmModal) => {
  const { queryParams, removeParam } = Hook.QueryParams();

  return (
    <ModalWrapper
      {...modalProps}
      onClose={() => modalProps?.onClose ?? removeParam('confirm')}
      isOpen={modalProps?.isOpen ?? !!queryParams.confirm}
      containerProps={{
        ...modalProps?.containerProps,
        onClick: (e) => modalProps?.containerProps?.onClick ?? e.stopPropagation(),
        className: `p-6! ${modalProps?.containerProps?.className || ''}`,
      }}
      className={`bg-primary-invert! max-w-md border-2 [&>div]:p-4! [&>div>div]:p-0! [&>div>div>svg]:hidden ${
        type !== 'custom'
          ? type === 'success'
            ? 'border-green-500'
            : type === 'error'
              ? 'border-red-500'
              : type === 'warning'
                ? 'border-yellow-500'
                : ''
          : ''
      } ${modalProps?.className || ''}`}
    >
      <div className="rounded-xl! p-1.5">
        {type !== 'custom' ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <TopIconLayer type={type} />
            <div className="flex flex-col gap-2 text-center">
              {title && (
                <GradientText
                  text={title}
                  type="accent"
                  className="text-lg/5 font-semibold md:text-xl/6 lg:text-2xl/6"
                />
              )}
              <p className="text-tertiary text-xs/4 font-light md:text-sm/5 lg:text-base/5">
                {description}
              </p>
            </div>
            {buttons && (
              <div className="flex w-full items-center justify-center gap-4">
                {buttons.left && (
                  <Button
                    {...buttons.left}
                    pattern="secondary"
                    className={`max-h-10 rounded-md! ${buttons.left.className || ''}`}
                    buttonProps={{
                      ...buttons.left.buttonProps,
                      onClick: (e) => {
                        buttons.left?.buttonProps?.onClick?.(e);
                        modalProps?.onClose();
                      },
                    }}
                  />
                )}
                {buttons.right && (
                  <Button
                    {...buttons.right}
                    pattern="primary"
                    className={`max-h-10 rounded-md! ${buttons.right.className || ''}`}
                    buttonProps={{
                      ...buttons.right.buttonProps,
                      onClick: (e) => {
                        if (buttons.right?.buttonProps?.onClick) {
                          buttons.right.buttonProps.onClick(e);
                        } else {
                          modalProps?.onClose();
                        }
                      },
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </ModalWrapper>
  );
};
