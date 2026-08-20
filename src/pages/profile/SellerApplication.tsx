import type { TSellerApprovalStatus } from '@beautinique/frontend-types';
import { Navigate } from 'react-router-dom';

import ApiStatus from '@/components/layout/ApiStatus';
import { StaticPageHeader } from '@/components/layout/static-page';
import Badge from '@/components/ui/Badge';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import { useGetMySeller } from '@/services/organization-service/seller.service.query';
import { formatDate } from '@/utils/common.util';

const STATUS_BADGE_CLASSNAME: Record<TSellerApprovalStatus, string> = {
  PENDING: 'text-primary-yellow border-primary-yellow/30 bg-primary-yellow/5',
  APPROVED: 'text-primary-green border-primary-green/30 bg-primary-green/5',
  REJECTED: 'text-primary-red border-primary-red/30 bg-primary-red/5',
};

const STATUS_COPY: Record<TSellerApprovalStatus, { title: string; description: string }> = {
  PENDING: {
    title: 'Your application is under review',
    description:
      "We've received your seller application and it's waiting on our territory admin to review it. We'll email you as soon as there's an update.",
  },
  APPROVED: {
    title: "You're approved!",
    description:
      'Your seller application has been approved — head over to the seller dashboard to start listing products.',
  },
  REJECTED: {
    title: 'Application not approved',
    description: 'Your seller application was not approved this time.',
  },
};

const SellerApplication = () => {
  const { data: seller, isLoading, isError } = useGetMySeller();

  if (isLoading) {
    return <ApiStatus status="loading" text="Loading your application..." />;
  }

  // Nothing submitted yet - nothing to show here, send them to apply instead.
  if (!isError && !seller) {
    return <Navigate to={`/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.BECOME_SELLER}`} replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <StaticPageHeader
        icon="solar:document-text-linear"
        title="Seller Application"
        description="Track the status of your seller application here."
      />

      {isError || !seller ? (
        <ApiStatus
          status="error"
          title="Failed to load your application"
          description="Something went wrong while fetching your application. Please try again."
        />
      ) : (
        <div className="border-primary/10 bg-secondary-invert flex flex-col gap-5 rounded-xl border p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-primary font-semibold">{seller.businessDetails.name}</span>
              <span className="text-tertiary text-xs">
                Applied {formatDate(seller.createdAt)} · {seller.address.city},{' '}
                {seller.address.state}
              </span>
            </div>
            <Badge
              content={seller.approvalStatus.toLowerCase()}
              className={`capitalize ${STATUS_BADGE_CLASSNAME[seller.approvalStatus]}`}
            />
          </div>

          <div className="border-primary/10 border-t pt-5">
            <GradientText
              type="accent"
              text={STATUS_COPY[seller.approvalStatus].title}
              className="text-base font-semibold sm:text-lg"
            />
            <p className="text-secondary mt-2 text-sm">
              {STATUS_COPY[seller.approvalStatus].description}
            </p>

            {seller.approvalStatus === 'REJECTED' && seller.history?.rejectReason && (
              <p className="text-primary-red mt-3 text-sm">
                <span className="font-semibold">Reason: </span>
                {seller.history.rejectReason}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerApplication;
