import { BEAUTY_FACTS } from '@/constants/common.constants';
import type { TClassName } from '@/types/component.type';
import { useEffect, useMemo, useState } from 'react';
import Teddy from './teddy';

const LoadingScreen = ({ className = '' }: TClassName) => {
  const TEXT_CHANGE_INTERVAL = 5000;

  const [fact, setFact] = useState(BEAUTY_FACTS[getRandomIndex(BEAUTY_FACTS)]);
  useEffect(() => {
    const textIntervalId = setInterval(() => {
      const getRandomFactIndex = getRandomIndex(BEAUTY_FACTS);
      setFact(BEAUTY_FACTS[getRandomFactIndex]);
    }, TEXT_CHANGE_INTERVAL);

    return () => clearInterval(textIntervalId);
  }, [BEAUTY_FACTS]);

  const loadingText = useMemo(
    () => (
      <p
        dangerouslySetInnerHTML={{ __html: fact }}
        className="gradient-text-silver text-sm text-shadow-2xs md:text-lg"
      />
    ),
    [fact],
  );
  function getRandomIndex(array: string[]) {
    return Math.floor(Math.random() * array.length);
  }
  return (
    <div
      className={`fixed inset-0 z-100 flex h-dvh w-dvw flex-col items-center justify-center bg-[radial-gradient(circle,rgba(var(--primary-rgb),0.5)_0%,rgba(var(--primary-rgb),0.2)_30%,rgba(var(--primary-invert-rgb),0.2)_60%,rgba(var(--primary-invert-rgb),1)_100%)] px-10 ${className}`}
    >
      <Teddy />
      <div className="border-primary/50 absolute bottom-[10%] mx-10 max-w-4xl rounded-xl border px-4 py-2 text-center backdrop-blur-2xl">
        {loadingText}
      </div>
    </div>
  );
};

export default LoadingScreen;
