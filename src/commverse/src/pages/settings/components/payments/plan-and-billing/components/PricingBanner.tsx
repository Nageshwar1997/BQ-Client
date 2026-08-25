import Button from '../../../../../../components/Button';
import ManagePlanModal from './ManagePlanModal';
import BuyCreditsModal from './BuyCreditsModal';
import CircularProgress from '../../../../../../components/CircularProgress';

interface PricingBannerProps {
  isManageModalOpen: boolean;
  isBuyCreditsModalOpen: boolean;
  onOpenManage: () => void;
  onCloseManage: () => void;
  onOpenBuyCredits: () => void;
  onCloseBuyCredits: () => void;
}

const PricingBanner = ({
  isManageModalOpen,
  isBuyCreditsModalOpen,
  onOpenManage,
  onCloseManage,
  onOpenBuyCredits,
  onCloseBuyCredits,
}: PricingBannerProps) => {
  return (
    <section className="relative w-full overflow-hidden rounded-[20px] bg-white">
      <img
        src="/assets/images/settings/payments/plan-banner-bg.png"
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-30"
      />
      <div
        className="relative z-10 flex min-h-28.25 w-full flex-wrap items-end gap-x-6 gap-y-4 rounded-[20px] p-4 sm:p-5 lg:gap-x-10.75"
        style={{
          backgroundImage:
            'linear-gradient(179.811deg, #ffffff 1.1881%, rgba(255,255,255,0) 98.798%), linear-gradient(79.5285deg, rgba(255,168,0,0.08) 0%, rgba(25,187,125,0.08) 24.91%, rgba(0,82,204,0.08) 48.82%, rgba(69,164,236,0.08) 72.18%, rgba(184,95,255,0.08) 88.31%)',
        }}
      >
        <img
          src="/assets/icons/brand-profile-bg.svg"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="flex min-w-65 flex-1 basis-[56%] flex-col gap-2">
          <p className="text-neutral-gray-900 text-[20px] leading-6 font-bold">
            You're On Free Plan
          </p>

          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-1">
              <span className="text-neutral-gray-700 text-xs leading-4.5 font-medium">
                There are
              </span>
              <CircularProgress value={150} max={450} />
              <span className="text-neutral-gray-700 text-xs leading-4.5 font-medium">
                <span className="text-neutral-gray-900 font-bold">150</span>
                {` credits remaining on your Free plan`}
              </span>
            </div>
            <p className="text-neutral-gray-700 text-xs leading-4.5 font-medium">
              Buy or Upgrade Plan for more credits and full access to all
              features
            </p>
          </div>
        </div>

        <div className="ml-auto flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-4.5">
          <Button
            variant="tertiary"
            size="sm"
            content="Buy Credits"
            className="h-8! w-fit! px-3!"
            onClick={onOpenBuyCredits}
          />

          <Button
            variant="ghost"
            size="sm"
            content="Manage"
            className="h-8! w-fit! px-3!"
            onClick={onOpenManage}
          />
        </div>

        {/* modals */}
        <ManagePlanModal open={isManageModalOpen} onClose={onCloseManage} />
        <BuyCreditsModal
          open={isBuyCreditsModalOpen}
          onClose={onCloseBuyCredits}
        />
      </div>
    </section>
  );
};

export default PricingBanner;
