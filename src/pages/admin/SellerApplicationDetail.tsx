import { useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import { ConfirmModal } from '@/components/layout/modals/ConfirmModal';
import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { SELLER_STATUSES_MAP } from '@/constants/api.constants';
import { TOAST_TYPE } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import {
  useApproveSellerApplication,
  useGetSellerApplicationById,
} from '@/services/organization-service/seller.service.query';
import { formatDate } from '@/utils/common.util';

import RejectApplicationModal from './children/RejectApplicationModal';

const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-center justify-between gap-4 py-1.5 text-[13px]">
    <span className="text-primary/50">{label}</span>
    <span className="text-primary max-w-[60%] truncate text-right font-medium">{value ?? '—'}</span>
  </div>
);

const DocumentLink = ({ label, url }: { label: string; url?: string }) => (
  <div className="flex items-center justify-between gap-4 py-1.5 text-[13px]">
    <span className="text-primary/50">{label}</span>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-crayola-c font-medium hover:underline"
      >
        View
      </a>
    ) : (
      <span className="text-primary/30">—</span>
    )}
  </div>
);

const SellerApplicationDetail = () => {
  const { pathParams } = usePathParams();
  const sellerId = pathParams.sellerId ?? '';

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const { data: application, isLoading, isError } = useGetSellerApplicationById(sellerId);
  const approveApplication = useApproveSellerApplication({ sellerId });

  if (isLoading) {
    return <ApiStatus status="loading" text="Loading application..." />;
  }

  if (isError || !application) {
    return (
      <ApiStatus
        status="error"
        title="Failed to load application"
        description="Something went wrong while fetching this seller application. Please try again."
      />
    );
  }

  const isPending = application.status === SELLER_STATUSES_MAP.PENDING;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <GradientText
          type="accent"
          text={application.businessName}
          className="text-lg font-semibold sm:text-xl"
        />
        {isPending && (
          <div className="flex gap-3">
            <Button
              pattern="secondary"
              buttonProps={{
                onClick: () => {
                  setIsRejectModalOpen(true);
                },
              }}
              content="Reject"
            />
            <Button
              pattern="primary"
              buttonProps={{
                onClick: () => {
                  setIsApproveModalOpen(true);
                },
              }}
              content="Approve"
            />
          </div>
        )}
      </div>

      <div className="border-primary/10 divide-primary/10 divide-y rounded-lg border">
        <div className="p-4">
          <GradientText type="silver" text="Business details" className="text-sm font-semibold" />
          <SummaryRow label="Business type" value={application.businessType} />
          <SummaryRow label="GSTIN" value={application.gstin} />
          <SummaryRow label="PAN" value={application.pan} />
          <SummaryRow label="Status" value={application.status} />
          <SummaryRow label="Submitted" value={formatDate(application.createdAt)} />
        </div>
        <div className="p-4">
          <GradientText type="silver" text="Bank & tax details" className="text-sm font-semibold" />
          <SummaryRow label="Account holder" value={application.bankDetails.accountHolderName} />
          <SummaryRow label="Account number" value={application.bankDetails.accountNumber} />
          <SummaryRow label="IFSC code" value={application.bankDetails.ifscCode} />
          <SummaryRow label="Bank name" value={application.bankDetails.bankName} />
        </div>
        <div className="p-4">
          <GradientText type="silver" text="Pickup address" className="text-sm font-semibold" />
          <SummaryRow
            label="Address"
            value={[
              application.pickupAddress.addressLine1,
              application.pickupAddress.addressLine2,
              application.pickupAddress.city,
              application.pickupAddress.state,
              application.pickupAddress.pincode,
              application.pickupAddress.country,
            ]
              .filter(Boolean)
              .join(', ')}
          />
        </div>
        <div className="p-4">
          <GradientText type="silver" text="Documents" className="text-sm font-semibold" />
          <DocumentLink label="ID proof" url={application.documents.idProof} />
          <DocumentLink label="Address proof" url={application.documents.addressProof} />
          <DocumentLink label="Business license" url={application.documents.businessLicense} />
        </div>
        {application.history &&
          (application.history.rejectReason ?? application.history.approvedAt) && (
            <div className="p-4">
              <GradientText type="silver" text="Review history" className="text-sm font-semibold" />
              {application.history.approvedAt && (
                <SummaryRow
                  label="Approved at"
                  value={formatDate(application.history.approvedAt)}
                />
              )}
              {application.history.rejectedAt && (
                <SummaryRow
                  label="Rejected at"
                  value={formatDate(application.history.rejectedAt)}
                />
              )}
              {application.history.rejectReason && (
                <SummaryRow label="Reject reason" value={application.history.rejectReason} />
              )}
            </div>
          )}
      </div>

      <ConfirmModal
        type={TOAST_TYPE.success}
        title="Approve this application?"
        description="The seller's account will be upgraded and they'll be notified."
        modalProps={{
          isOpen: isApproveModalOpen,
          onClose: () => {
            setIsApproveModalOpen(false);
          },
        }}
        buttons={{
          left: { content: 'Cancel' },
          right: {
            content: 'Approve',
            buttonProps: {
              disabled: approveApplication.isPending,
              onClick: () => {
                approveApplication.mutate(sellerId, {
                  onSuccess: () => {
                    setIsApproveModalOpen(false);
                  },
                });
              },
            },
          },
        }}
      />

      <RejectApplicationModal
        sellerId={sellerId}
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
        }}
      />
    </div>
  );
};

export default SellerApplicationDetail;
