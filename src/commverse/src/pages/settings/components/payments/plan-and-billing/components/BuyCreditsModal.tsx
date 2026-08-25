import Button from '../../../../../../components/Button';
import Modal from '../../../../../../components/Modal';
import { VersaAiBlackStars } from '../../../../../../icons';

const PricingCard = ({
  amount,
  label,
  price,
  savingsBadge,
  onBuy,
}: {
  amount: string;
  label: string;
  price: string;
  savingsBadge?: string;
  onBuy?: () => void;
}) => {
  return (
    <div className="group relative flex min-h-[204px] w-full flex-col overflow-clip rounded-[20px] border border-[#eaebf1] bg-white shadow-sm">
      {/* Background Texture Layer */}
      {/* <div className="absolute bottom-[-1px] h-[561px] left-[-1px] opacity-30 w-[840px] pointer-events-none">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover size-full"
          src={imgImage2552}
        />
      </div> */}

      {/* Gradient & Content Container */}
      <div
        className="absolute inset-0 flex flex-col items-start justify-between overflow-clip rounded-[inherit] p-[20px]"
        style={{
          backgroundImage:
            'linear-gradient(179.196deg, rgb(255, 255, 255) 1.1881%, rgba(255, 255, 255, 0) 98.798%), linear-gradient(87.5178deg, rgba(255, 168, 0, 0.08) 0%, rgba(25, 187, 125, 0.08) 24.91%, rgba(0, 82, 204, 0.08) 48.82%, rgba(69, 164, 236, 0.08) 72.18%, rgba(184, 95, 255, 0.08) 88.31%)',
        }}
      >
        {/* Top Part */}
        <div className="flex w-full flex-col items-start gap-[8px]">
          <div className="flex items-center justify-center gap-[8px]">
            <VersaAiBlackStars />
            <p className="text-[32px] leading-[1.2] font-bold whitespace-nowrap text-[#18181a]">
              {amount}
            </p>
            {savingsBadge && (
              <div className="ml-1 flex h-[20px] shrink-0 items-center justify-center rounded-[30px] bg-[#dcfae6] px-[12px] py-[4px]">
                <span className="text-[10px] leading-[1.35] font-medium whitespace-nowrap text-[#067647] uppercase">
                  {savingsBadge}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-start gap-[4px] text-[12px] leading-normal font-medium whitespace-nowrap text-[#48494d]">
            <span>Model Generation:</span>
            <span>{label}</span>
          </div>
        </div>

        {/* Bottom Part */}
        <div className="mt-auto flex w-full items-center justify-between">
          <p className="text-[20px] leading-[1.2] font-bold text-[#18181a]">
            ${price}
          </p>
          <Button
            onClick={onBuy}
            variant="tertiary"
            size="sm"
            content="Buy Now"
            className="w-fit!"
          />
        </div>
      </div>

      {/* Border Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] border border-[#eaebf1]"
      />
    </div>
  );
};

const BuyCreditsModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const handleBuy = (amount: string) => {
    alert(`Purchasing ${amount} credits...`);
  };

  return (
    <Modal open={open} onClose={onClose} className="[&>div]:max-w-[1140px]!">
      <div className="bg-neutral-gray-150 relative w-full overflow-hidden rounded-3xl border border-[#eaebf1] shadow-lg">
        <div className="flex flex-col gap-5 p-10">
          <div className="flex h-10 w-full items-center justify-between">
            <h1 className="text-[24px] leading-[1.2] font-bold text-[#18181a]">
              Buy Credits
            </h1>
            <Button
              variant="ghost"
              content="Cancel"
              className="w-fit!"
              onClick={onClose}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              amount="40"
              label="Fast & Turbo"
              price="20"
              onBuy={() => handleBuy('40')}
            />
            <PricingCard
              amount="100"
              label="Fast & Turbo"
              price="60"
              onBuy={() => handleBuy('100')}
            />
            <PricingCard
              amount="500"
              label="Fast & Turbo,Large"
              price="120"
              savingsBadge="Save 20%"
              onBuy={() => handleBuy('500')}
            />
            <PricingCard
              amount="1000"
              label="Fast & Turbo,Large"
              price="200"
              onBuy={() => handleBuy('1000')}
            />
            <PricingCard
              amount="3000"
              label="Fast & Turbo,Large"
              price="300"
              onBuy={() => handleBuy('3000')}
            />
            <PricingCard
              amount="4000"
              label="Fast & Turbo,Large"
              price="1000"
              onBuy={() => handleBuy('4000')}
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl border border-[#eaebf1]"
        />
      </div>
    </Modal>
  );
};

export default BuyCreditsModal;
