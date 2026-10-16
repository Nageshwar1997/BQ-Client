import { type RefObject, useCallback, useEffect, useState } from 'react';

/**
 * Fullscreen toggle scoped to one element (the Try-On canvas panel - so the controls/dock inside it
 * come along, not just the bare canvas). Tracks the *browser's* state through `fullscreenchange`
 * rather than its own flag, so leaving with Esc / the browser's own exit gesture keeps the button
 * in sync too.
 *
 * `isSupported` is false where the Fullscreen API doesn't cover arbitrary elements (iPhone Safari
 * only fullscreens a `<video>`) - callers should hide the button there instead of showing one that
 * silently does nothing.
 */
export default function useFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isSupported = document.fullscreenEnabled;

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(
        document.fullscreenElement !== null && document.fullscreenElement === targetRef.current,
      );
    };

    document.addEventListener('fullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
    };
  }, [targetRef]);

  const toggle = useCallback(() => {
    const target = targetRef.current;
    if (!target) return;

    if (document.fullscreenElement === target) {
      void document.exitFullscreen();
      return;
    }

    target.requestFullscreen().catch(() => {
      // Refused (e.g. the browser blocked it) - nothing to recover, the button just stays as-is.
    });
  }, [targetRef]);

  return { isSupported, isFullscreen, toggle };
}
