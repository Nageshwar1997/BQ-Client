import { useEffect, useState } from "react";

type TResendOtp = { label: string; count: number; onResend?: () => void };

const Resend = ({ onResend, count, label = "Not received?" }: TResendOtp) => {
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
      <span className="bg-clip-text text-transparent bg-silver-duo text-xs md:text-sm">
        {label}
      </span>

      {counter > 0 ? (
        <span className="text-xs md:text-sm text-muted">
          <span className="bg-clip-text text-transparent bg-silver-duo">
            Resend in
          </span>{" "}
          <strong className="bg-clip-text text-transparent bg-accent-duo">
            {counter}s
          </strong>
        </span>
      ) : (
        <button
          onClick={handleResend}
          className="bg-clip-text text-transparent bg-accent-duo hover:font-medium text-sm md:text-base"
        >
          Resend
        </button>
      )}
    </p>
  );
};

export default Resend;
