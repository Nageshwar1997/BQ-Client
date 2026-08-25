import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { TTryOn } from '../../../types';
import LogoHeader from '../components/LogoHeader';
import Button from '../../../components/Button';
import ImmersivePDP from '../immersive-pdp';
import Chip from '../../../components/Chip';
import { CreateIcon, VersaAISolidLogoIcon } from '../../../icons';
import { Icon } from '@iconify/react';
import { getProductSnapshot } from '../../../services/onboarding';
import { syncUserSessionFromCurrentToken } from '../../../lib/syncUserSession';
import SaveWarnModal from '../../../components/Overlay/SaveWarnModal';
import { useDeleteExperience } from '../../../services/experience-services';
import { useDeleteProductCMS } from '../../../services/product-service';
import { handleListExperiences } from '../../../services/api';

const PENDING_TRYON_CLEANUP_KEY = 'onboarding:pending-tryon-cleanup';

type OnBoardingSuccessProps = {
  sessionId?: string;
  immersivePdpProps: {
    profilePhoto?: string | null;
    vibeDescription?: string | null;
    productUrl?: string | null;
    productImages?: string[] | null;
    productName?: string | null;
    productDescription?: string | null;
    productColors?: string[] | null;
    category?: string | null;
    subCategory: TTryOn;
    generatedModelUrl?: string | null;
    generatedThumbnailUrl?: string | null;
    publishedLink?: string | null;
  };
  isImmersivePDPOpen?: boolean;
  shouldAutoGenerate3D?: boolean;
};

const BrandOnBoardingSuccess = ({
  sessionId,
  immersivePdpProps,
  shouldAutoGenerate3D = false,
}: OnBoardingSuccessProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteExperienceMutation = useDeleteExperience();
  const deleteProductCMSMutation = useDeleteProductCMS();
  const allowExitRef = useRef(false);
  const hasArmedBackGuardRef = useRef(false);
  const [isImmersiveOpen, setIsImmersiveOpen] = useState(false);
  const [showLeaveWarnModal, setShowLeaveWarnModal] = useState(false);
  const [isDashboardNavigating, setIsDashboardNavigating] = useState(false);
  const productUrl = immersivePdpProps?.productUrl ?? '';
  const productSnapshotStorageKey = productUrl
    ? `onboarding:product-snapshot:${productUrl}`
    : null;
  const fallbackSnapshotUrl =
    immersivePdpProps?.productImages?.[0] ??
    immersivePdpProps?.generatedThumbnailUrl ??
    null;
  const cachedSnapshotUrl = useMemo(() => {
    if (typeof sessionStorage !== 'undefined' && productSnapshotStorageKey) {
      const cachedSnapshot = sessionStorage.getItem(productSnapshotStorageKey);
      if (cachedSnapshot?.trim()) {
        return cachedSnapshot;
      }
    }

    return null;
  }, [productSnapshotStorageKey]);
  const [fetchedSnapshot, setFetchedSnapshot] = useState<{
    productUrl: string;
    url: string | null;
  } | null>(null);
  const immersivePipelineStorageKey = sessionId
    ? `onboarding:immersive-pipeline:${sessionId}`
    : null;
  const productSnapshotUrl =
    fetchedSnapshot?.productUrl === productUrl
      ? fetchedSnapshot.url
      : (cachedSnapshotUrl ?? fallbackSnapshotUrl);

  const cleanupOnboardingTryOnArtifacts = async () => {
    if (typeof sessionStorage === 'undefined') return;

    const rawPipelineState = immersivePipelineStorageKey
      ? sessionStorage.getItem(immersivePipelineStorageKey)
      : null;

    let tryOnExperienceId: string | null = null;
    let arExperienceId: string | null = null;
    let productId: string | null = null;
    const experienceIdsToDelete = new Set<string>();

    if (rawPipelineState?.trim()) {
      try {
        const parsed = JSON.parse(rawPipelineState) as {
          tryOnExperienceId?: string | null;
          arExperienceId?: string | null;
          productId?: string | null;
        };
        tryOnExperienceId =
          typeof parsed.tryOnExperienceId === 'string' &&
          parsed.tryOnExperienceId.trim()
            ? parsed.tryOnExperienceId
            : null;
        arExperienceId =
          typeof parsed.arExperienceId === 'string' &&
          parsed.arExperienceId.trim()
            ? parsed.arExperienceId
            : null;
        productId =
          typeof parsed.productId === 'string' && parsed.productId.trim()
            ? parsed.productId
            : null;
        if (tryOnExperienceId) {
          experienceIdsToDelete.add(tryOnExperienceId);
        }
        if (arExperienceId) {
          experienceIdsToDelete.add(arExperienceId);
        }
      } catch {
        // Ignore malformed temp storage.
      }
    }

    const productName = immersivePdpProps.productName?.trim() || '';
    const expectedExperienceTitles = [
      productName ? `${productName} Fashion Try-on` : null,
      productName ? `${productName} Try-on` : null,
      productName ? `${productName} AR Experience` : null,
    ].filter((value): value is string => Boolean(value));

    sessionStorage.setItem(
      PENDING_TRYON_CLEANUP_KEY,
      JSON.stringify({
        experienceIds: Array.from(experienceIdsToDelete),
        titles: expectedExperienceTitles,
        productId,
      })
    );

    if (productName) {
      try {
        const [
          beautyResponse,
          fashionResponse,
          arDraftResponse,
          arPublishedResponse,
        ] = await Promise.all([
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'draft',
            type: 'beauty_tryon',
          }),
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'draft',
            type: 'fashion_tryon',
          }),
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'draft',
            type: 'ar_experience',
          }),
          handleListExperiences({
            page: 1,
            limit: 100,
            status: 'published',
            type: 'ar_experience',
          }),
        ]);

        const combinedResults = [
          ...(Array.isArray(beautyResponse?.data) ? beautyResponse.data : []),
          ...(Array.isArray(fashionResponse?.data) ? fashionResponse.data : []),
          ...(Array.isArray(arDraftResponse?.data) ? arDraftResponse.data : []),
          ...(Array.isArray(arPublishedResponse?.data)
            ? arPublishedResponse.data
            : []),
        ];

        const recentMatches = combinedResults.filter(
          (item: Record<string, unknown>) => {
            const id =
              typeof item?._id === 'string' && item._id.trim()
                ? item._id
                : null;
            if (!id) return false;

            const title =
              typeof item?.title === 'string' ? item.title.trim() : '';
            const type = typeof item?.type === 'string' ? item.type.trim() : '';
            const itemProductId =
              typeof item?.productId === 'string' ? item.productId.trim() : '';
            const updatedAtValue =
              typeof item?.updatedAt === 'string' ? item.updatedAt : '';
            const updatedAtMs = updatedAtValue
              ? new Date(updatedAtValue).getTime()
              : 0;
            const isRecent =
              Number.isFinite(updatedAtMs) &&
              updatedAtMs > 0 &&
              Date.now() - updatedAtMs < 2 * 60 * 60 * 1000;

            return (
              isRecent &&
              (type === 'fashion_tryon' ||
                type === 'beauty_tryon' ||
                type === 'ar_experience') &&
              (expectedExperienceTitles.includes(title) ||
                (productName && title.includes(productName)) ||
                (productId && itemProductId === productId))
            );
          }
        );

        for (const item of recentMatches) {
          if (typeof item._id === 'string' && item._id.trim()) {
            experienceIdsToDelete.add(item._id);
          }
        }
      } catch {
        // Ignore lookup failures and fall back to direct ID cleanup.
      }
    }

    await Promise.allSettled(
      Array.from(experienceIdsToDelete).map((id) =>
        deleteExperienceMutation.mutateAsync(id)
      )
    );

    if (productId) {
      try {
        await deleteProductCMSMutation.mutateAsync(productId);
      } catch {
        // Best-effort cleanup; navigation should not be blocked.
      }
    }

    if (immersivePipelineStorageKey) {
      sessionStorage.removeItem(immersivePipelineStorageKey);
    }
    if (productSnapshotStorageKey) {
      sessionStorage.removeItem(productSnapshotStorageKey);
    }
    sessionStorage.removeItem('onboarding-success-payload');
    void queryClient.invalidateQueries({ queryKey: ['get-experiences'] });
    void queryClient.invalidateQueries({ queryKey: ['get-product-cms'] });
  };

  const handleGoToDashboard = () => {
    void (async () => {
      if (isDashboardNavigating) return;
      setIsDashboardNavigating(true);
      allowExitRef.current = true;
      setShowLeaveWarnModal(false);
      try {
        await cleanupOnboardingTryOnArtifacts();
        await syncUserSessionFromCurrentToken();
        await navigate('/dashboard');
      } finally {
        setIsDashboardNavigating(false);
      }
    })();
  };

  const handleOpenDashboardInNewTab = () => {
    // const dashboardTab = window.open('', '_blank');

    void (async () => {
      await cleanupOnboardingTryOnArtifacts();
      await syncUserSessionFromCurrentToken();

      // if (dashboardTab && !dashboardTab.closed) {
      //   dashboardTab.location.href = '/dashboard';
      //   return;
      // }
      navigate('/dashboard', { replace: true });
      // window.open('/dashboard', '_blank', 'noopener,noreferrer');
    })();
  };

  useEffect(() => {
    if (!productUrl) return;

    let isActive = true;
    const fetchSnapshot = async () => {
      try {
        const result = await getProductSnapshot(productUrl);
        if (!isActive) return;
        const nextSnapshotUrl = result?.snapshotUrl ?? fallbackSnapshotUrl;
        if (nextSnapshotUrl && productSnapshotStorageKey) {
          sessionStorage.setItem(productSnapshotStorageKey, nextSnapshotUrl);
        }
        setFetchedSnapshot({ productUrl, url: nextSnapshotUrl });
      } catch {
        if (isActive) {
          setFetchedSnapshot({ productUrl, url: fallbackSnapshotUrl });
        }
      }
    };

    void fetchSnapshot();

    return () => {
      isActive = false;
    };
  }, [fallbackSnapshotUrl, productSnapshotStorageKey, productUrl]);

  useEffect(() => {
    void syncUserSessionFromCurrentToken();
  }, []);

  useEffect(() => {
    if (!hasArmedBackGuardRef.current) {
      window.history.pushState(
        { onboardingSuccessGuard: true },
        '',
        window.location.href
      );
      hasArmedBackGuardRef.current = true;
    }

    const handlePopState = () => {
      if (allowExitRef.current) return;
      window.history.pushState(
        { onboardingSuccessGuard: true },
        '',
        window.location.href
      );
      setShowLeaveWarnModal(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (allowExitRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-white">
      <div className="relative z-10 flex h-[88px] items-center justify-center bg-linear-to-b from-white from-50% to-transparent px-12 py-5">
        <LogoHeader
          className="h-auto justify-center"
          logoClassName="h-[16px] w-auto"
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pb-12">
        <div className="flex items-center gap-3 text-center">
          <h1 className="font-metropolis text-neutral-gray-900 text-[32px]/[38px] font-semibold">
            Boom, your Immersive Product Experience is LIVE!
          </h1>
          <Icon icon="lucide:rocket" className="size-8 shrink-0" />
        </div>

        <div className="bg-neutral-gray-150 mt-9 w-full max-w-[960px] rounded-[28px] p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr]">
            {/* Left (Before) */}
            <div className="pointer-events-none flex flex-col items-center gap-4">
              <div className="flex h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl bg-white">
                {productSnapshotUrl ? (
                  <img
                    src={productSnapshotUrl}
                    alt={immersivePdpProps.productName ?? 'Product snapshot'}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
                    <img
                      src="/assets/icons/logo-icon.svg"
                      alt="Commverse"
                      className="size-10 animate-spin object-contain"
                    />
                    <p className="text-neutral-gray-700 text-sm font-medium">
                      Loading product snapshot
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <Chip
                  text="Static Product Page"
                  variant="secondary"
                  className="rounded-[10px] px-4 py-2 text-[14px]"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden items-center justify-center md:flex">
              <div className="h-full w-px bg-[#D0D1D9]" />
            </div>

            {/* Right (After) */}
            <div
              className={`flex flex-col items-center gap-4 ${!isImmersiveOpen ? 'pointer-events-none' : ''}`}
            >
              <div
                className={`${!isImmersiveOpen ? 'relative h-[260px]' : 'h-full'} flex w-full items-center justify-center overflow-hidden rounded-2xl bg-white`}
              >
                <div
                  className={`${isImmersiveOpen ? 'fixed inset-0 z-50 h-full' : 'absolute h-[812px] scale-[0.4]'} w-full origin-center overflow-hidden rounded-3xl`}
                >
                  <ImmersivePDP
                    {...immersivePdpProps}
                    isActive={true}
                    shouldAutoGenerate3D={shouldAutoGenerate3D}
                    onGoToDashboard={handleOpenDashboardInNewTab}
                    onClose={() => setIsImmersiveOpen(false)}
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <Chip
                  text="Immersive Product Page"
                  variant="tertiary"
                  leftIcon={
                    <CreateIcon className="size-3! stroke-white [&>path]:stroke-2!" />
                  }
                  className="rounded-[10px] px-4 py-2 text-[14px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <div className="w-[235px]">
            <Button
              variant="primary"
              content="View Immersive Page"
              leftIcon={
                <VersaAISolidLogoIcon className="fill-neutral-gray-100 size-5" />
              }
              onClick={() => {
                setIsImmersiveOpen(true);
              }}
            />
          </div>
          <div className="w-[200px]">
            <Button
              variant="tertiary"
              content="Get Started"
              isLoading={isDashboardNavigating}
              rightIcon={
                <Icon
                  icon="solar:round-arrow-right-linear"
                  className="size-5"
                />
              }
              onClick={handleGoToDashboard}
            />
          </div>
        </div>
      </div>
      {/* {isImmersiveOpen ? (
        <div className="fixed inset-0 z-50">
          <ImmersivePDP
            {...immersivePdpProps}
            isActive={isImmersivePdpOpen}
            shouldAutoGenerate3D={shouldAutoGenerate3D}
            onGoToDashboard={handleOpenDashboardInNewTab}
            onClose={() => setIsImmersiveOpen(false)}
          />
        </div>
      ) : null} */}
      {showLeaveWarnModal ? (
        <SaveWarnModal
          open={showLeaveWarnModal}
          showLeftSection={false}
          title="Leave this page?"
          subtitle="Using the browser back button may send you into an outdated onboarding state. Go to the dashboard instead, or stay here and continue exploring the experience."
          showContinueButton={false}
          saveExitLabel="Go to Dashboard"
          discardLabel="Stay Here"
          footerText="Reloading or leaving this page may reopen stale onboarding data."
          onClose={() => {
            setShowLeaveWarnModal(false);
            window.history.pushState(
              { onboardingSuccessGuard: true },
              '',
              window.location.href
            );
          }}
          onSaveExit={handleGoToDashboard}
          isSaveExitLoading={isDashboardNavigating}
          onDiscardChanges={() => {
            setShowLeaveWarnModal(false);
            window.history.pushState(
              { onboardingSuccessGuard: true },
              '',
              window.location.href
            );
          }}
        />
      ) : null}
    </div>
  );
};

export default BrandOnBoardingSuccess;
