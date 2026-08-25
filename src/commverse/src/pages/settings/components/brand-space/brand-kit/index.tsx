import { Link, Outlet, useLocation, useOutletContext } from 'react-router';
import {
  useGetBrand,
  useUpdateBrand,
} from '../../../../../services/auth-service';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { deepEqual } from '../../../../../lib/utils';
import ToastCard from '../../../../../components/AlertCards/ToastCard';
import type { ToastCardProps } from '../../../../../types';

export interface BrandKitType {
  colors: {
    primary: { value: string }[];
    secondary: { value: string }[];
    others: { value: string }[];
  };
  fonts: string[];
}

export interface BrandKitContext {
  draftKit: Partial<BrandKitType> | null;
  updateDraftKit: (updates: Partial<BrandKitType>) => void;
  isUpdating: boolean;
  onSave: (currentDraft?: Partial<BrandKitType>) => void;
  onCancel: () => void;
}

const BrandKit = () => {
  const { pathname } = useLocation();
  const parentContext = useOutletContext<Record<string, unknown>>();

  const getBrandQuery = useGetBrand();
  const updateBrandQuery = useUpdateBrand();

  const [draftKit, setDraftKit] = useState<Partial<BrandKitType> | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const draftKitRef = useRef<BrandKitType | null>(null);

  // Keep ref in sync for onSave closure
  useEffect(() => {
    draftKitRef.current = draftKit as BrandKitType;
  }, [draftKit]);

  useEffect(() => {
    const kit = getBrandQuery.data?.data?.kit;
    if (kit && !hasInitialized) {
      const normalizedKit: BrandKitType = {
        colors: {
          primary: (kit.colors?.primary ?? []).map((v: string) => ({
            value: v,
          })),
          secondary: (kit.colors?.secondary ?? []).map((v: string) => ({
            value: v,
          })),
          others: (kit.colors?.others ?? []).map((v: string) => ({ value: v })),
        },
        fonts: kit.fonts ?? [],
      };

      setTimeout(() => {
        setDraftKit(normalizedKit);
        setHasInitialized(true);
      }, 0);
    }
  }, [getBrandQuery.data?.data?.kit, hasInitialized]);

  const updateDraftKit = useCallback((updates: Partial<BrandKitType>) => {
    setDraftKit((prev) => {
      // If no previous state, we need to at least ensure valid structure or wait for init
      if (!prev) return null;

      const next = {
        colors: updates.colors
          ? { ...prev.colors, ...updates.colors }
          : prev.colors,
        fonts: updates.fonts ?? prev.fonts,
      } as BrandKitType;

      if (deepEqual(prev, next)) return prev;
      return next;
    });
  }, []);

  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState<number>(0);

  const showToast = useCallback((toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  }, []);

  const onSave = useCallback(() => {
    const kitToSave = draftKitRef.current;
    if (!kitToSave || !kitToSave.colors) return;

    // Convert back to API format (primary colors string array etc)
    const apiKit = {
      colors: {
        primary: kitToSave.colors.primary.map(
          (c: { value: string }) => c.value
        ),
        secondary: kitToSave.colors.secondary.map(
          (c: { value: string }) => c.value
        ),
        others: kitToSave.colors.others.map((c: { value: string }) => c.value),
      },
      fonts: kitToSave.fonts || [],
    };

    const formData = new FormData();
    formData.append('kit', JSON.stringify(apiKit));

    updateBrandQuery.mutate(formData, {
      onSuccess: () => {
        showToast({
          title: 'Brand kit updated successfully',
          type: 'success',
        });
      },
      onError: () => {
        showToast({
          title: 'Failed to update brand kit',
          type: 'error',
        });
      },
    });
  }, [updateBrandQuery, showToast]);

  const onCancel = useCallback(() => {
    const kit = getBrandQuery.data?.data?.kit;
    if (kit) {
      const normalizedKit: BrandKitType = {
        colors: {
          primary: (kit.colors?.primary ?? []).map((v: string) => ({
            value: v,
          })),
          secondary: (kit.colors?.secondary ?? []).map((v: string) => ({
            value: v,
          })),
          others: (kit.colors?.others ?? []).map((v: string) => ({ value: v })),
        },
        fonts: kit.fonts ?? [],
      };
      setDraftKit(normalizedKit);
    }
  }, [getBrandQuery.data?.data?.kit]);

  return (
    <div className="text-neutral-gray-900 font-metropolis relative flex h-full max-w-3/5 flex-col gap-3">
      <div className="leading-5 font-semibold">Brand Kit</div>
      <div className="flex grow flex-col gap-4 overflow-hidden">
        <div className="border-neutral-gray-400 bg-neutral-gray-300 grid min-h-10 grid-cols-4 rounded-xl border p-1">
          {['Colors', 'Typography', 'Assets', 'Vibe'].map((item) => {
            const redirectUrl = `/settings/brand-space/brand-kit/${item.toLowerCase()}`;

            return (
              <Link
                key={item}
                to={redirectUrl}
                className={`flex h-full items-center justify-center text-xs text-[#1A1A1A] ${pathname === redirectUrl ? 'bg-neutral-gray-100 rounded-lg font-semibold' : 'font-medium'}`}
              >
                {item}
              </Link>
            );
          })}
        </div>
        <div className="grow overflow-hidden">
          <Outlet
            context={useMemo(
              () => ({
                ...parentContext,
                draftKit,
                updateDraftKit,
                isUpdating: updateBrandQuery.isPending,
                onSave,
                onCancel,
              }),
              [
                parentContext,
                draftKit,
                updateDraftKit,
                updateBrandQuery.isPending,
                onSave,
                onCancel,
              ]
            )}
          />
        </div>
      </div>
      {toastCardProps && (
        <div className="absolute top-0 right-0 z-50">
          <ToastCard key={toastId} {...toastCardProps} />
        </div>
      )}
    </div>
  );
};

export default BrandKit;
