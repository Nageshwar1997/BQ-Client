import type { ILoading } from '@/Types/Common.type';
import { LoadingRings } from './LoadingRings';

export const LoadingPage = ({ text, className = '' }: ILoading) => {
  return (
    <div
      className={`bg-primary-invert/50 fixed inset-0 z-100 flex h-full w-full items-center justify-center ${className}`}
    >
      <LoadingRings text={text} />
    </div>
  );
};
