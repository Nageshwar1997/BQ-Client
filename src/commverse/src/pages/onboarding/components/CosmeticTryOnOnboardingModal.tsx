import Modal from '../../../components/Modal';
import type { TEyeliner, TKajal, TLip, TTryOn } from '../../../types';
import CosmeticTryOn from '../../virtual-tryon/component/CosmeticTryOn';

const CosmeticTryOnOnboardingModal = ({
  open,
  onClose,
  variants,
  ...props
}: {
  open: boolean;
  onClose: () => void;
  productTitle: string;
  productLink?: string;
  showExperienceMeta?: boolean;
  onNext: () => void;
  isNextLoading?: boolean;
  subCategory: TTryOn;
  type?: TLip | TEyeliner | TKajal;
  variants: string[];
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="[&>div]:h-full [&>div]:max-h-[80dvh] [&>div]:min-h-[60dvh] [&>div]:max-w-7xl"
    >
      <CosmeticTryOn {...props} variants={variants} />
    </Modal>
  );
};

export default CosmeticTryOnOnboardingModal;
