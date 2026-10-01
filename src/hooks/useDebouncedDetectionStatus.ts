import { useEffect, useState } from 'react';

import type { TDetectionStatus } from '@/types/tryon-types';

import useDebounce from './useDebounce';

// How long a non-'detected' detection-status reading has to hold continuously before this hook's
// returned value actually changes to it - showing a "not in frame"/"turned" overlay the instant a
// single frame reports one flickers constantly, since a stray frame or two of jitter/motion-blur/
// momentary occlusion is normal and shouldn't interrupt the flow. Recovering to 'detected' (or to
// `undefined`, e.g. on a mode/model switch) is never debounced - only a genuine problem needs to
// hold for this long before it's surfaced.
const DETECTION_GUIDE_DEBOUNCE_MS = 1500;

/**
 * Debounces a raw, potentially-flickering `TDetectionStatus` reading (see that type's own comment
 * for what each value means) - used by TryOnModal to decide when its detection-guide overlay
 * actually shows. `rawStatus` should already be gated to `undefined` by the caller whenever
 * nothing meaningful can be read yet (e.g. before the stage is ready) - this hook only owns the
 * debounce timing, not that readiness gate.
 */
export default function useDebouncedDetectionStatus(
  rawStatus: TDetectionStatus | undefined,
): TDetectionStatus | undefined {
  const [debouncedStatus, setDebouncedStatus] = useState<TDetectionStatus | undefined>(undefined);

  // Shared debounce-a-callback hook (see useDebounce.ts) instead of a hand-rolled setTimeout/
  // cleanup pair - owns the timer/cleanup mechanics, this just supplies what to call and when.
  // `cancel` matters here specifically - see the effect below.
  const { trigger: debounceStatus, cancel: cancelDebounce } = useDebounce<
    [TDetectionStatus | undefined]
  >({
    callback: setDebouncedStatus,
    delay: DETECTION_GUIDE_DEBOUNCE_MS,
  });

  useEffect(() => {
    // Recovering to 'detected' (or resetting to no reading at all, e.g. on mode/model switch -
    // see `rawStatus` itself going back to `undefined` while a new engine spins up) is never
    // debounced - only showing the warning needs the "did this actually last a while" check, not
    // clearing it once things are genuinely fine again.
    if (!rawStatus || rawStatus === 'detected') {
      // Must cancel, not just skip scheduling a new one - a mode/model switch remounts the
      // stage's engine, whose fresh initial state briefly reports 'not-in-frame' (see
      // LipEngineBase.getInitialState) before the first real detection comes in. That transient
      // reading already started a debounced timer below; if the *real* 'detected' reading (this
      // branch) only set state directly without cancelling it, that stale timer would still fire
      // ~DETECTION_GUIDE_DEBOUNCE_MS later and clobber this correct value right back to
      // 'not-in-frame' - the overlay flashing on for no visible reason well after the switch. See
      // useDebounce.ts's `cancel` comment.
      cancelDebounce();
      // Mirrors an external signal (the engine's own state, by way of the caller's `rawStatus`),
      // not a render-derived value - a plain useMemo can't run this "only sometimes" conditionally
      // against a timer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDebouncedStatus(rawStatus);
      return;
    }

    debounceStatus(rawStatus);
  }, [rawStatus, debounceStatus, cancelDebounce]);

  return debouncedStatus;
}
