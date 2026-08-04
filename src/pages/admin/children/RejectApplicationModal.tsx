import { useState } from 'react';

import { ConfirmModal } from '@/components/layout/modals/ConfirmModal';
import GradientText from '@/components/ui/GradientText';
import Textarea from '@/components/ui/inputs/Textarea';
import { TOAST_TYPE } from '@/constants/common.constants';
import { useRejectSellerApplication } from '@/services/organization-service/seller.service.query';

interface IRejectApplicationModalProps {
  sellerId: string;
  isOpen: boolean;
  onClose: () => void;
}

// A `ConfirmModal` variant using the `custom` type slot to embed a required reason `Textarea` —
// the standard success/error/warning variants have no body input, only an icon/title/description.
const RejectApplicationModal = ({ sellerId, isOpen, onClose }: IRejectApplicationModalProps) => {
  const [reason, setReason] = useState('');
  const rejectApplication = useRejectSellerApplication({ sellerId });

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <ConfirmModal
      type={TOAST_TYPE.custom}
      modalProps={{ isOpen, onClose: handleClose }}
      buttons={{
        left: { content: 'Cancel' },
        right: {
          content: 'Reject application',
          buttonProps: {
            disabled: !reason.trim() || rejectApplication.isPending,
            onClick: () => {
              rejectApplication.mutate(
                { sellerId, reason: reason.trim() },
                { onSuccess: handleClose },
              );
            },
          },
        },
      }}
    >
      <div className="flex w-full flex-col gap-4">
        <GradientText
          type="silver"
          text="Reject this application?"
          className="text-lg font-semibold"
        />
        <Textarea
          label="Reason for rejection"
          textAreaProps={{
            name: 'rejectReason',
            placeholder: 'Explain why this application is being rejected...',
            value: reason,
            onChange: (event) => {
              setReason(event.target.value);
            },
          }}
        />
      </div>
    </ConfirmModal>
  );
};

export default RejectApplicationModal;
