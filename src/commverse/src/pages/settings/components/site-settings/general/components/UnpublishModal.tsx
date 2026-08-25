import Modal from '../../../../../../components/Modal';
import Button from '../../../../../../components/Button';

type UnpublishModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subdomain?: string;
  isLoading?: boolean;
};

const UnpublishModal = ({
  open,
  onClose,
  onConfirm,
  subdomain,
  isLoading,
}: UnpublishModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="[&>div]:h-min [&>div]:w-[500px]"
    >
      <div className="flex h-full w-full flex-col gap-4 p-8">
        <div className="flex flex-col gap-2">
          <div className="text-neutral-gray-900 text-xl font-bold">
            Unpublish site?
          </div>
          <div className="text-neutral-gray-600 text-sm leading-5">
            Unpublishing{' '}
            <span className="font-semibold text-neutral-900">{subdomain}</span>{' '}
            will take this experience offline.
          </div>
        </div>
        <div className="flex w-full justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            content="Cancel"
            size="sm"
            className="h-10 px-6!"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            content="Unpublish"
            size="sm"
            className="bg-ui-error! h-10 px-6! hover:opacity-90!"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UnpublishModal;
