import Modal from '../../../../../../components/Modal';
import Button from '../../../../../../components/Button';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subdomain?: string;
  isLoading?: boolean;
};

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  subdomain,
  isLoading,
}: DeleteConfirmModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="[&>div]:h-min [&>div]:w-[500px]"
    >
      <div className="flex h-full w-full flex-col gap-4 p-8">
        <div className="flex flex-col gap-2">
          <div className="text-neutral-gray-900 text-xl font-bold">
            Are you absolutely sure?
          </div>
          <div className="text-neutral-gray-600 text-sm leading-5">
            This action cannot be undone. This will permanently delete{' '}
            <span className="font-semibold text-neutral-900">{subdomain}</span>{' '}
            from our servers.
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
            content="Continue"
            size="sm"
            className="bg-ui-error! h-10 px-6! hover:opacity-90!"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
