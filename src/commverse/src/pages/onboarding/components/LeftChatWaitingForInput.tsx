import { CommverseSparkleIcon } from '../../../icons';
import { useRotatingMessages } from '../hooks/useRotatingMessages';

type LeftChatWaitingForInputProps = {
  className?: string;
  messages?: string[];
  intervalMs?: number;
};

const LeftChatWaitingForInput = ({
  className = '',
  messages,
  intervalMs,
}: LeftChatWaitingForInputProps) => {
  const currentMessage = useRotatingMessages(messages, intervalMs);

  return (
    <div
      className={`flex w-full items-start ${className}`}
      data-name="Chat Messages"
      data-node-id="6050:428771"
    >
      <div className="inline-flex items-center gap-[clamp(6px,0.625vw,8px)]">
        <div className="size-[clamp(18px,1.5625vw,20px)] shrink-0">
          <CommverseSparkleIcon />
        </div>
        <p className="ai-status-gradient-text text-sm/[17.5px] italic">
          {currentMessage}
        </p>
      </div>
    </div>
  );
};

export default LeftChatWaitingForInput;
