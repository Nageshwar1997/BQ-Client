import { useMemo, useRef } from 'react';

type RightChatImageMessageProps = {
  imageSrc: string;
  alt?: string;
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

const RightChatImageMessage = ({
  imageSrc,
  alt = 'chat attachment',
  sentAt,
  time,
  showTime = true,
  className = '',
}: RightChatImageMessageProps) => {
  const sendTimeRef = useRef<Date>(sentAt ? new Date(sentAt) : new Date());

  const resolvedTime = useMemo(
    () => time ?? formatUserLocalTime(sendTimeRef.current),
    [time],
  );

  return (
    <div
      className={`w-full flex flex-col items-end ${className}`}
      data-name="Chat Messages"
      data-node-id="6050:428768"
    >
      <div
        className="flex flex-col items-end gap-1"
        data-name="Chat Elements"
        data-node-id="I6050:428768;4678:309128"
      >
        <div
          className="flex items-start gap-[clamp(6px,0.625vw,8px)]"
          data-node-id="I6050:428768;4678:309128;5052:376103"
        >
          <div
            className="size-[clamp(140px,15.625vw,200px)] p-[clamp(7px,0.78125vw,10px)] rounded-[clamp(14px,1.5625vw,20px)] border border-neutral-gray-300 bg-white overflow-hidden flex items-center justify-center"
            data-name="Image"
            data-node-id="I6050:428768;4678:309128;5052:376077"
          >
            <img
              src={imageSrc}
              alt={alt}
              className="size-full object-contain rounded-[clamp(8px,0.9375vw,12px)]"
            />
          </div>
        </div>
        {showTime && (
          <p
            className="text-[10px] leading-[13.5px] font-normal text-neutral-gray-600"
            data-node-id="I6050:428768;4678:309128;4685:441511"
          >
            {resolvedTime}
          </p>
        )}
      </div>
    </div>
  );
};

export default RightChatImageMessage;
