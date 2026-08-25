import { Icon } from '@iconify/react';
import { useSignOutAll, useGetUserDetail } from '../../services/auth-service';
import { clearLoggedInData, getUser, getImageUrl } from '../../lib/utils';
import { useUIStore } from '../../lib/store';
import { MoreOptionsMenu } from '../MoreOptionsMenu';

type UserprofileVariant = 'full' | 'avatar-trigger' | 'avatar' | 'avatar-menu';

interface UserprofileProps {
  variant?: UserprofileVariant;
  showDetails?: boolean;
  className?: string;
}

const resolveUserPlan = (
  subscription: unknown
): 'free' | 'pro' | 'business' => {
  if (!subscription || typeof subscription !== 'object') return 'free';

  const source = subscription as Record<string, unknown>;
  const plan = source.plan as Record<string, unknown> | undefined;
  const candidates = [
    source.planId,
    source.planName,
    source.planType,
    source.tier,
    plan?.id,
    plan?.name,
    plan?.type,
  ];

  const normalized = candidates
    .map((value) =>
      String(value ?? '')
        .trim()
        .toLowerCase()
    )
    .join(' ');

  if (normalized.includes('business')) return 'business';
  if (normalized.includes('pro')) return 'pro';
  return 'free';
};

const getInitials = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length > 1 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const Userprofile = ({
  variant = 'full',
  showDetails = true,
  className = '',
}: UserprofileProps) => {
  const { setIsLoggingOut } = useUIStore();
  const signOutAllMutation = useSignOutAll();
  const user = getUser();
  const userDetailQuery = useGetUserDetail();

  const handleSignOut = () => {
    setIsLoggingOut(true);
    clearLoggedInData();
  };

  const handleSignOutAll = () => {
    setIsLoggingOut(true);
    signOutAllMutation.mutate(undefined, {
      onSuccess: () => {
        clearLoggedInData();
      },
      onError: () => {
        setIsLoggingOut(false);
      },
    });
  };

  const profilePhotoUrl: string | null =
    getImageUrl(userDetailQuery.data?.profilePhoto) || null;
  const resolvedUserName: string | null =
    userDetailQuery.data?.name || user?.user?.name || null;
  const userName = resolvedUserName || 'User';
  const totalAllocatedCredits = userDetailQuery.data?.credits?.remaining || 0;
  const subscription = resolveUserPlan(userDetailQuery.data?.subscription);
  const isProfileVariant = variant === 'full';
  const isAvatarOnlyVariant = variant === 'avatar';
  const isAvatarTriggerVariant = variant === 'avatar-trigger';
  const isAvatarMenuNoTriggerVariant = variant === 'avatar-menu';
  const shouldUseDefaultAvatar = !profilePhotoUrl;
  const avatarSrc = shouldUseDefaultAvatar
    ? '/assets/images/default-user.jpg'
    : profilePhotoUrl;

  const avatar = avatarSrc ? (
    <img
      src={avatarSrc}
      alt="Profile"
      className={`block aspect-square size-10 max-h-10 min-h-10 max-w-10 min-w-10 shrink-0 self-center rounded-full object-cover shadow-sm ${isAvatarOnlyVariant ? className : ''}`}
    />
  ) : (
    <div
      className={`bg-neutral-gray-200 font-metropolis text-brand flex aspect-square size-10 max-h-10 min-h-10 max-w-10 min-w-10 shrink-0 items-center justify-center self-center rounded-full text-sm leading-none font-semibold ${isAvatarOnlyVariant ? className : ''}`}
    >
      {getInitials(userName)}
    </div>
  );

  const details = (
    <div className="font-metropolis flex flex-col gap-1 text-left font-medium">
      <div className="flex items-center gap-2">
        <span className="text-neutral-gray-900 max-w-30 truncate text-sm leading-none capitalize">
          {userName}
        </span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] leading-none font-bold tracking-wide uppercase ${
            subscription === 'pro'
              ? 'bg-purple-100 text-purple-700'
              : subscription === 'business'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
          }`}
        >
          {subscription}
        </span>
      </div>
      <span className="text-neutral-gray-600 text-xs whitespace-nowrap">
        {totalAllocatedCredits} Credits left
      </span>
    </div>
  );

  if (isAvatarOnlyVariant) {
    return avatar;
  }

  return (
    <MoreOptionsMenu
      triggerClassName={`flex cursor-pointer! rounded-md focus:outline-none text-neutral-gray-900 items-start ${
        isProfileVariant ? 'items-center gap-3' : 'items-center gap-2'
      } ${className}`}
      rotateTriggerOnOpen
      menuClassName="mt-3 min-w-56"
      menuItems={[
        {
          label: 'Sign out',
          icon: 'solar:logout-2-linear',
          onClick: handleSignOut,
          showDividerBelow: true,
        },
        {
          label: 'Sign out from all devices',
          onClick: handleSignOutAll,
          disabled: signOutAllMutation.isPending,
          variant: 'danger',
          icon: 'solar:devices-linear',
        },
      ]}
      triggerContent={({ isMenuOpen }) => (
        <>
          {avatar}
          {isProfileVariant && showDetails && details}
          {(isProfileVariant || isAvatarTriggerVariant) && (
            <Icon
              icon="solar:alt-arrow-down-linear"
              width={16}
              className={`shrink-0 transition-transform ${
                isMenuOpen ? 'rotate-180' : ''
              }`}
            />
          )}
          {isAvatarMenuNoTriggerVariant && null}
        </>
      )}
    />
  );
};

export default Userprofile;
