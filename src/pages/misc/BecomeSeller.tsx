import { useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import { SELLER_STATUSES_MAP } from '@/constants/api.constants';
import {
  useGetDraftSellerApplication,
  useGetMySellerApplication,
} from '@/services/organization-service/seller.service.query';

import {
  ApplicationApprovedScreen,
  ApplicationPendingScreen,
  ApplicationRejectedScreen,
} from './become-seller/ApplicationStatusScreens';
import SellerOnboardingWizard from './become-seller/SellerOnboardingWizard';

// Branches `/become-seller` between the onboarding wizard and the pending/approved/rejected
// status screens, based on whether the current user already has a seller application on file.
const BecomeSeller = () => {
  const [isResubmitting, setIsResubmitting] = useState(false);

  const {
    data: application,
    isLoading: isApplicationLoading,
    isError: isApplicationError,
  } = useGetMySellerApplication();

  const { data: draft, isLoading: isDraftLoading } = useGetDraftSellerApplication({
    enabled: !isApplicationLoading && !application,
  });

  if (isApplicationLoading || (!application && isDraftLoading)) {
    return <ApiStatus status="loading" text="Checking your seller application..." />;
  }

  if (isApplicationError) {
    return (
      <ApiStatus
        status="error"
        title="Failed to load your application"
        description="Something went wrong while checking your seller application status. Please try again."
      />
    );
  }

  if (application?.status === SELLER_STATUSES_MAP.PENDING) {
    return <ApplicationPendingScreen />;
  }

  if (application?.status === SELLER_STATUSES_MAP.APPROVED) {
    return <ApplicationApprovedScreen />;
  }

  if (application?.status === SELLER_STATUSES_MAP.REJECTED && !isResubmitting) {
    return (
      <ApplicationRejectedScreen
        application={application}
        onResubmit={() => {
          setIsResubmitting(true);
        }}
      />
    );
  }

  return <SellerOnboardingWizard draft={isResubmitting ? application : draft} />;
};

export default BecomeSeller;
