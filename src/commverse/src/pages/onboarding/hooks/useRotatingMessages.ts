import { useEffect, useMemo, useState } from 'react';

const DEFAULT_MESSAGES = ['Waiting for your input...'];

export const useRotatingMessages = (
  messages?: string[],
  intervalMs = 1000
) => {
  const resolvedMessages = useMemo(
    () => (messages && messages.length > 0 ? messages : DEFAULT_MESSAGES),
    [messages]
  );
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (resolvedMessages.length <= 1) return;

    const timer = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % resolvedMessages.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, resolvedMessages]);

  return resolvedMessages[messageIndex % resolvedMessages.length];
};
