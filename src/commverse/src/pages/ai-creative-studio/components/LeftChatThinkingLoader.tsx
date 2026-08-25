type LeftChatThinkingLoaderProps = {
  className?: string;
};

const CommverseDotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="10" fill="#002DFF" />
    <path
      d="M9.10877 4.61857C9.41477 3.79145 10.5852 3.79145 10.8912 4.61857C11.661 6.69835 13.3016 8.33899 15.3814 9.10878C16.2085 9.41477 16.2085 10.5852 15.3814 10.8912C13.3016 11.661 11.661 13.3016 10.8912 15.3814C10.5852 16.2085 9.41477 16.2085 9.10877 15.3814C8.33899 13.3016 6.69835 11.661 4.61857 10.8912C3.79145 10.5852 3.79145 9.41477 4.61857 9.10878C6.69835 8.33899 8.33899 6.69835 9.10877 4.61857Z"
      fill="white"
    />
  </svg>
);

const LeftChatThinkingLoader = ({ className = '' }: LeftChatThinkingLoaderProps) => {
  return (
    <div
      className={`w-full flex items-start ${className}`}
      data-name="Chat Messages"
      data-node-id="6050:428769"
    >
      <div
        className="inline-flex items-center gap-[clamp(6px,0.625vw,8px)]"
        data-node-id="I6050:428769;4685:441706"
      >
        <div
          className="size-[clamp(18px,1.5625vw,20px)] shrink-0"
          data-name="Commverse Icon"
          data-node-id="I6050:428769;4685:441579"
        >
          <CommverseDotIcon />
        </div>
        <p
          className="animate-thinking-sweep inline-block text-sm leading-[17.5px] font-normal italic text-transparent bg-clip-text [-webkit-text-fill-color:transparent] [background-image:linear-gradient(90deg,#797a80_0%,#797a80_30%,#b6b7bf_50%,#797a80_70%,#797a80_100%)] [background-size:260%_100%] [background-position:130%_50%] [will-change:background-position]"
          data-node-id="I6050:428769;4685:441702"
        >
          Thinking...
        </p>
      </div>
    </div>
  );
};

export default LeftChatThinkingLoader;
