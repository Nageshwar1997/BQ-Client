type DeploymentSuccessCardProps = {
  onGoToDashboard?: () => void;
  experienceUrl?: string | null;
};

const DeploymentSuccessCard = ({
  onGoToDashboard,
  experienceUrl,
}: DeploymentSuccessCardProps) => {
  const qrCodeUrl = experienceUrl
    ? `https://chart.googleapis.com/chart?cht=qr&chs=239x239&chl=${encodeURIComponent(experienceUrl)}`
    : 'https://chart.googleapis.com/chart?cht=qr&chs=239x239&chl=https%3A%2F%2Fsocial.ctruh.com';

  return (
    <div className="border-neutral-gray-300 w-full rounded-3xl border bg-white p-10">
      <p className="text-neutral-gray-900 mb-8 text-center text-2xl leading-[1.2] font-bold">
        Scan QR Code to View in Your Space!
      </p>

      <div className="flex flex-col items-center gap-8">
        <div className="overflow-hidden rounded-[28px] shadow-[0px_12px_26px_0px_rgba(56,75,159,0.1),0px_46px_46px_0px_rgba(56,75,159,0.09)]">
          <img
            src={qrCodeUrl}
            alt="QR Code – Scan to view your immersive experience"
            className="block size-59.75"
            loading="lazy"
          />
        </div>

        <button
          type="button"
          onClick={onGoToDashboard}
          className="bg-neutral-gray-900 hover:bg-neutral-gray-800 rounded-xl px-8 py-3 text-base font-semibold text-white transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DeploymentSuccessCard;
