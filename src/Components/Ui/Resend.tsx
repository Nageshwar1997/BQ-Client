import { useEffect, useState } from 'react';
import GradientText from './GradientText';
import type { IResend } from '@/types/component.type';

const Resend = ({ onResend, count, label = 'Not received?', className }: IResend) => {
  const [counter, setCounter] = useState(count);

  useEffect(() => {
    if (counter <= 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter > 0]);

  const handleResend = async () => {
    if (counter > 0) return;

    onResend?.();
    setCounter(count); // reset timer after resend
  };

  return (
    <p className={`space-x-2 ${className || ''}`}>
      <GradientText text={label} type="silver" className="text-xs sm:text-sm" />
      {counter > 0 ? (
        <span className="text-muted text-xs sm:text-sm">
          <GradientText text="Resend in" type="silver" />{' '}
          <GradientText text={`${counter}s`} type="accent" className="font-semibold" />
        </span>
      ) : (
        <button onClick={handleResend} className="cursor-pointer" type="button">
          <GradientText
            type="accent"
            text="Resend"
            className="text-xs font-semibold sm:text-sm"
          />
        </button>
      )}
    </p>
  );
};

export default Resend;
