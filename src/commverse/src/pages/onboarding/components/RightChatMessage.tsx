import { useMemo, useRef } from 'react';

type RightChatMessageProps = {
  message: string;
  sentAt?: Date | string | number;
  time?: string;
  showTime?: boolean;
  className?: string;
};

const formatUserLocalTime = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

const RightChatMessage = ({
  message,
  sentAt,
  time,
  showTime = true,
  className = '',
}: RightChatMessageProps) => {
  const sendTimeRef = useRef<Date>(sentAt ? new Date(sentAt) : new Date());

  const resolvedTime = useMemo(
    () => time ?? formatUserLocalTime(sendTimeRef.current),
    [time]
  );

  return (
    <div
      className={`flex w-full flex-col flex-wrap items-end ${className}`}
      data-name="Chat Messages"
      data-node-id="4678:309112"
    >
      <div
        className="flex flex-col items-end gap-1"
        data-name="Type=Text, User=User"
        data-node-id="4678:309089"
      >
        <div
          className="bg-neutral-gray-150 border-neutral-gray-300 font-metropolis max-w-[clamp(220px,57.8125vw,740px)] rounded-[clamp(6px,0.625vw,8px)] border px-3 py-2"
          data-node-id="4685:441492"
        >
          <p className="text-neutral-gray-900 line-clamp-3 text-sm/[17.5px] font-normal break-all">
            {message}
          </p>
        </div>
        {showTime && (
          <p
            className="text-neutral-gray-600 text-[10px]/[13.5px] font-normal"
            data-node-id="4685:441505"
          >
            {resolvedTime}
          </p>
        )}
      </div>
    </div>
  );
};

export default RightChatMessage;
