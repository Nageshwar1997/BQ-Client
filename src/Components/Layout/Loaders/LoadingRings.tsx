import { LOADING_RINGS_DATA } from '@/Constants';
import type { ILoading } from '@/Types';

export const LoadingRings = ({ className = '', text = 'Loading....' }: ILoading) => {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <div className="relative flex flex-col items-center">
        <div className="relative h-[20vmin] w-[20vmin]">
          {LOADING_RINGS_DATA.map((ring, index) => (
            <div
              key={index}
              className="absolute inset-0 animate-[ring-spin_2s_linear_infinite] rounded-full border-solid shadow-[0_0_10px_rgb(var(--primary-rgb),0.15)]"
              style={{
                ['--rx' as string]: `${ring.rotation.rx}deg`,
                ['--ry' as string]: `${ring.rotation.ry}deg`,
                ['--z' as string]: `${ring.rotation.z}deg`,
                borderColor: ring.border.color,
                [ring.border.side]: '0.6vmin',
                animationDelay: `${index * -0.5}s`,
              }}
            />
          ))}
        </div>
        <div className="mt-[4vmin] flex gap-[0.2vmin] text-[3vmin] font-medium">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="bg-accent-duo translate-y-2 animate-[loading-text_3s_ease-in-out_infinite] bg-clip-text text-transparent opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
