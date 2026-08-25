import { useState } from 'react';
import Modal from '../../Modal';
import Button from '../../Button';
import Input from '../../Input';

interface RenameModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  initialValue: string;
  title?: string;
  subtitle?: string;
}

const RenameModal = ({
  open,
  onClose,
  onConfirm,
  initialValue,
  title = 'Rename Experience',
  subtitle = 'Type the new name for your experience below',
}: RenameModalProps) => {
  const [value, setValue] = useState(initialValue);

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="[&>div]:max-w-[480px]!">
      <div className="font-metropolis flex flex-col p-8 text-left">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-[28px] leading-tight font-bold text-neutral-900">
            {title}
          </h2>
          <p className="text-neutral-gray-600 text-[14px]">{subtitle}</p>
        </div>

        <div className="mb-6 w-full">
          <label className="text-neutral-gray-900 mb-2 block text-[12px] font-semibold">
            Experience Name
          </label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Experience Name"
            className="border-neutral-gray-200 placeholder:text-neutral-gray-300 w-full rounded-xl px-4 py-3.5 text-[14px]"
            autoFocus
          />
        </div>

        <div className="flex w-full gap-4">
          <Button
            variant="secondary"
            className="text-neutral-gray-900! hover:bg-neutral-gray-200! h-[52px] flex-1 rounded-xl bg-[#F0F1F6]! text-[16px] font-bold"
            content="Cancel"
            onClick={onClose}
          />
          <Button
            className="bg-brand! h-[52px] flex-1 rounded-xl text-[16px] font-bold"
            content="Confirm"
            onClick={handleConfirm}
            disabled={!value.trim() || value === initialValue}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RenameModal;
