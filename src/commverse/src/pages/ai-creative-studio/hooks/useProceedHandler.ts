import { useCallback, useState } from 'react';

type ProceedHandlerProps<T> = {
  isProceeding?: boolean;
  onProceed?: (payload: T) => Promise<boolean | void> | boolean | void;
};

export function useProceedHandler<T>({
  isProceeding,
  onProceed,
}: ProceedHandlerProps<T>) {
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [hasProceeded, setHasProceeded] = useState(false);

  const isSubmitting =
    typeof isProceeding === 'boolean' ? isProceeding : internalSubmitting;
  const isDisabled = isSubmitting || hasProceeded;

  const handleProceedClick = useCallback(
    async (payload: T) => {
      if (isSubmitting || hasProceeded) return;

      if (typeof isProceeding === 'boolean') {
        const result = await onProceed?.(payload);
        if (result !== false) {
          setHasProceeded(true);
        }
        return;
      }

      setInternalSubmitting(true);
      try {
        const result = await onProceed?.(payload);
        if (result !== false) {
          setHasProceeded(true);
        }
      } finally {
        setInternalSubmitting(false);
      }
    },
    [hasProceeded, isProceeding, isSubmitting, onProceed]
  );

  return {
    handleProceedClick,
    isDisabled,
    isSubmitting,
  };
}
