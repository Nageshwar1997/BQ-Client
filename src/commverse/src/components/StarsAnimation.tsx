import { useEffect, useState } from 'react';
import { BigVersaStar, SmallVersaStar } from '../icons';
import { versaGenerationAiAdjectives } from '../constants';

export const Countdown = ({
  startPermission = false,
  // startedAt,
}: {
  startPermission: boolean;
  startedAt?: number | null;
}) => {
  // const [time, setTime] = useState(0);
  // const startTimeRef = useRef<number | null>(null);
  const [aiJargon, setAiJargon] = useState(versaGenerationAiAdjectives[0]);

  // useEffect(() => {
  //   if (!startPermission) {
  //     setTime(0);
  //     startTimeRef.current = null;
  //     return;
  //   }

  //   startTimeRef.current = startedAt ?? Date.now();
  //   setTime(Date.now() - startTimeRef.current);

  //   const timer = setInterval(() => {
  //     if (startTimeRef.current) {
  //       setTime(Date.now() - startTimeRef.current);
  //     }
  //   }, 100); // 100ms → 1 digit precision

  //   return () => clearInterval(timer);
  // }, [startPermission, startedAt]);

  if (!startPermission) return null;

  let jargonIndex = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      jargonIndex += 1;
      if (jargonIndex >= versaGenerationAiAdjectives.length) {
        jargonIndex = 0;
      }
      setAiJargon(versaGenerationAiAdjectives[jargonIndex]);
    }, 7000); // 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-metropolis text-neutral-gray-900 text-[16px] leading-5">
      Please wait while versa is{' '}
      <span className="relative inline-block overflow-visible align-middle font-semibold italic transition">
        <span className="relative">{aiJargon}</span>
        <span className="shine-text absolute inset-0">{aiJargon}</span>
      </span>{' '}
      your 3D model
    </span>
  );
};

export const StarsAnimation = () => {
  return (
    <div className="relative flex rotate-45 items-center justify-center [&>div]:absolute [&>div]:[animation-timing-function:cubic-bezier(0.35,0,0.65,1)]">
      <div className="z-2 animate-[bigStarMove_1.5s_ease-in-out_infinite]">
        <BigVersaStar />
      </div>
      <div className="z-1 animate-[smallStarMove_1.5s_ease-in-out_infinite]">
        <SmallVersaStar />
      </div>
    </div>
  );
};

export const StarsWithoutAnimation = () => {
  return (
    <div className="relative flex rotate-45 items-center justify-center gap-2">
      <BigVersaStar className="rotate-45" />
      <SmallVersaStar className="rotate-45" />
    </div>
  );
};
