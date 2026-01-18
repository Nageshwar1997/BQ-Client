import { useEffect, useState } from 'react';
import GradientText from './GradientText';

type TResendOtp = { label: string; count: number; onResend?: () => void };

const Resend = ({ onResend, count, label = 'Not received?' }: TResendOtp) => {
  const [counter, setCounter] = useState(count);

  useEffect(() => {
    if (counter <= 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const handleResend = async () => {
    if (counter > 0) return;

    onResend?.();
    setCounter(count); // reset timer after resend
  };

  return (
    <p className="space-x-2">
      <GradientText text={label} type="silver" className="md:text-sm" />
      {counter > 0 ? (
        <span className="text-muted text-xs md:text-sm">
          <GradientText text="Resend in" type="silver" />{' '}
          <GradientText text={`${counter}s`} type="accent" className="font-bold" />
        </span>
      ) : (
        <button onClick={handleResend}>
          <GradientText
            type="accent"
            text="Resend"
            className="text-sm hover:font-medium md:text-base"
          />
        </button>
      )}
    </p>
  );
};

export default Resend;
