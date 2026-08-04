import { useEffect } from 'react';

import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import usePathParams from '@/hooks/usePathParams';
import { useGetSessionUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';
import type { TApiSellerApplicationBase } from '@/types/api.type';
import { formatDate } from '@/utils/common.util';

// While the application is pending, poll the session user so an admin approving it elsewhere is
// picked up here without requiring the seller to log out and back in.
const SESSION_POLL_INTERVAL_MS = 30 * 1000;

export const ApplicationPendingScreen = () => {
  const setUser = useUserStore((s) => s.setUser);

  const { data: sessionUser } = useGetSessionUser({ refetchInterval: SESSION_POLL_INTERVAL_MS });

  useEffect(() => {
    if (sessionUser && sessionUser.role === 'SELLER') {
      setUser(sessionUser);
    }
  }, [sessionUser, setUser]);

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <GradientText
        type="accent"
        text="Application under review"
        className="text-xl font-semibold sm:text-2xl"
      />
      <p className="text-tertiary max-w-md text-sm">
        Thanks for applying! Our team is reviewing your seller application and will notify you once
        a decision is made — this page updates automatically as soon as you&apos;re approved.
      </p>
    </div>
  );
};

export const ApplicationApprovedScreen = () => {
  const { navigate } = usePathParams();

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <GradientText
        type="accent"
        text="You're a seller!"
        className="text-xl font-semibold sm:text-2xl"
      />
      <p className="text-tertiary max-w-md text-sm">
        Your seller application has been approved. You can now start listing products from your
        account.
      </p>
      <Button
        pattern="primary"
        buttonProps={{ onClick: () => void navigate(ROUTES.HOME) }}
        content="Go to Home"
      />
    </div>
  );
};

interface IApplicationRejectedScreenProps {
  application: TApiSellerApplicationBase;
  onResubmit: () => void;
}

export const ApplicationRejectedScreen = ({
  application,
  onResubmit,
}: IApplicationRejectedScreenProps) => {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <GradientText
        type="accent"
        text="Application rejected"
        className="text-xl font-semibold sm:text-2xl"
      />
      <p className="text-tertiary max-w-md text-sm">
        {application.history?.rejectReason ?? 'Your seller application was not approved this time.'}
      </p>
      {application.history?.rejectedAt && (
        <p className="text-primary/40 text-xs">
          Rejected on {formatDate(application.history.rejectedAt)}
        </p>
      )}
      <Button
        pattern="primary"
        buttonProps={{ onClick: onResubmit }}
        content="Resubmit application"
      />
    </div>
  );
};
