import Button from '../../../../../../components/Button';
import CircularProgress from '../../../../../../components/CircularProgress';
import Modal from '../../../../../../components/Modal';

const ManagePlanModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="relative w-full rounded-3xl bg-white"
        data-name="Select Product"
      >
        <div className="relative flex w-full flex-col content-stretch items-start gap-6 overflow-clip rounded-[inherit] p-10">
          {/* Header */}
          <div className="relative flex w-full shrink-0 flex-col content-stretch items-start gap-1">
            <div className="relative flex w-full shrink-0 content-stretch items-center justify-between">
              <p className="relative shrink-0 text-[24px] leading-[1.2] font-bold whitespace-nowrap text-[#18181a] not-italic">
                Manage Plan
              </p>
            </div>
          </div>

          {/* Plan Info */}
          <div className="relative flex w-full shrink-0 content-stretch items-center justify-between">
            <div className="relative flex shrink-0 flex-col content-stretch items-start gap-1">
              <p className="relative shrink-0 text-[12px] leading-normal font-medium text-[#18181a] not-italic opacity-70">
                You're On Free Plan
              </p>
              <div className="relative flex shrink-0 content-stretch items-start">
                <div className="relative flex shrink-0 flex-col justify-center text-[14px] leading-0 font-medium whitespace-nowrap text-[#18181a] not-italic">
                  <p>
                    <span className="font-bold">$0</span>
                    <span className="leading-normal text-[#48494d] opacity-80">{` / Forever`}</span>
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant={'primary'}
              size={'sm'}
              content="Upgrade"
              className="h-8! w-24! rounded-lg"
            />
          </div>

          {/* Credits Info */}
          <div className="relative flex w-full shrink-0 content-stretch items-center justify-between">
            <div className="relative flex shrink-0 flex-col content-stretch items-start gap-1">
              <p className="relative shrink-0 text-[12px] leading-normal font-medium text-[#18181a] not-italic opacity-70">
                Credits
              </p>
              <div className="relative flex shrink-0 content-stretch items-center gap-2">
                <div className="relative flex shrink-0 flex-col justify-center text-[14px] leading-0 font-medium whitespace-nowrap text-[#48494d] not-italic">
                  <p className="leading-normal">There are</p>
                </div>
                <CircularProgress value={150} max={450} />
                <div className="relative flex shrink-0 flex-col justify-center text-[14px] leading-0 font-medium whitespace-nowrap text-[#18181a] not-italic">
                  <p>
                    <span className="font-bold">150</span>
                    <span className="leading-normal text-[#48494d] opacity-80">{` credits remaining on your Free plan`}</span>
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant={'tertiary'}
              size={'sm'}
              content="Buy Credits"
              className="h-8! w-24! rounded-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="relative mt-4 flex w-full shrink-0 flex-col content-stretch items-start gap-3">
            <div className="relative flex w-full shrink-0 content-stretch items-start gap-3">
              <Button
                content="Manage Billing Information"
                size={'md'}
                variant={'secondary'}
                className="w-fit!"
              />
              <Button
                content="View Invoices"
                size={'md'}
                variant={'secondary'}
                className="w-full! justify-center"
              />
            </div>
            <div className="flex w-full justify-center">
              <Button
                content="Cancel"
                size={'md'}
                variant={'ghost'}
                className="w-fit!"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[24px] border border-solid border-[#eaebf1]"
        />
      </div>
    </Modal>
  );
};

export default ManagePlanModal;
