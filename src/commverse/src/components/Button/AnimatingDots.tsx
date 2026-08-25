import type { FC } from 'react';

const AnimatingDots: FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex h-full items-center space-x-3">
      <div className={`h-1.75 w-1.75 rounded-full ${color}`}></div>
      <div
        className={`h-1.75 w-1.75 rounded-full ${color}`}
        style={{ animationDelay: '0.3s' }}
      ></div>
      <div
        className={`h-1.75 w-1.75 rounded-full ${color}`}
        style={{ animationDelay: '0.6s' }}
      ></div>
    </div>
  );
};

export default AnimatingDots;
