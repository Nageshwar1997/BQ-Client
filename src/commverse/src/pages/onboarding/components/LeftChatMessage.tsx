import { useMemo } from 'react';
import { CommverseIconChat } from '../../../icons';

type LeftChatMessageProps = {
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

const LeftChatMessage = ({
  message,
  sentAt,
  time,
  showTime = true,
  className = '',
}: LeftChatMessageProps) => {
  const sendTime = useMemo(
    () => (sentAt ? new Date(sentAt) : new Date()),
    [sentAt]
  );

  const resolvedTime = useMemo(
    () => time ?? formatUserLocalTime(sendTime),
    [sendTime, time]
  );

  const messageSegments = useMemo(() => message.split('\n\n'), [message]);
  const hasFollowUpCopy = messageSegments.length > 1;
  const primaryChars = useMemo(
    () => Array.from(messageSegments[0] ?? ''),
    [messageSegments]
  );
  const secondaryMessage = hasFollowUpCopy
    ? messageSegments.slice(1).join('\n\n')
    : '';

  return (
    <div
      className={`flex w-full flex-col items-start ${className}`}
      data-name="Chat Messages"
      data-node-id="4678:309112"
    >
      <div
        className={`flex max-w-full ${secondaryMessage ? 'items-start' : 'items-center'} gap-2`}
        data-name="Type=Text, User=AI"
        data-node-id="4678:309113"
      >
        <CommverseIconChat
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-col items-start gap-3 pt-0.5">
          <div
            className="rounded-lg"
            data-node-id="I4678:309114;4686:441812"
          >
            <p
              className="font-metropolis text-neutral-gray-900 text-sm flex items-center leading-tight font-medium whitespace-pre-wrap"
              data-node-id="I4678:309114;4686:441813"
            >
              {primaryChars.join('')}
            </p>
          </div>
          {secondaryMessage ? (
            <p className="font-metropolis text-neutral-gray-900 text-sm leading-tight font-medium whitespace-pre-wrap">
              {secondaryMessage}
            </p>
          ) : null}
          {showTime && (
            <p
              className="text-neutral-gray-600 text-[10px] leading-[13.5px] font-normal"
              data-node-id="I4678:309114;4686:441814"
            >
              {resolvedTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftChatMessage;
