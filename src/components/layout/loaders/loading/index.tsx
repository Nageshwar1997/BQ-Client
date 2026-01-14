import './Loading.css';

const Loading = ({ className, text = 'Loading....' }: { className?: string; text: string }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className={`relative h-[20vmin] w-[20vmin] ${className}`}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            id={`ring-${index + 1}`}
            className="absolute inset-0 animate-[ring-spin_2s_linear_infinite] rounded-full border-0 border-transparent shadow-[0_0_10px_rgb(var(--primary-rgb),0.1)]"
          />
        ))}
        <div className="mt-[20vmin] flex items-center justify-center gap-[0.2vmin] text-[3vmin]">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="bg-accent-duo text-shadow-blue-crayola-c/10 translate-y-2.5 transform animate-[loading-text_3s_ease-in-out_infinite] bg-clip-text text-transparent opacity-0 text-shadow-sm"
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

export default Loading;
