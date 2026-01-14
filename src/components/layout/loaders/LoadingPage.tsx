import type { ILoading } from '../../../types';
import Loading from './loading';

const LoadingPage = ({ text, className = '' }: ILoading) => {
  return (
    <div
      className={`bg-primary-inverted/50 fixed inset-0 z-100 flex h-full w-full items-center justify-center ${className}`}
    >
      <Loading text={text} />
    </div>
  );
};

export default LoadingPage;
