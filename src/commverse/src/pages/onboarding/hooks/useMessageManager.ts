import { useCallback, useRef } from 'react';

import type {
  OnboardingCard,
  OnboardingChatLine,
} from '../../../types/onboarding';
import type { OnboardingStateAction } from '../onboarding.types';

type Dispatch = (action: OnboardingStateAction) => void;

type AppendedMessage =
  | Omit<Extract<OnboardingChatLine, { kind: 'text' }>, 'id'>
  | Omit<Extract<OnboardingChatLine, { kind: 'card' }>, 'id'>;

export function useMessageManager(dispatch: Dispatch) {
  const messageCounterRef = useRef(0);

  const createMessageId = useCallback((prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${messageCounterRef.current}`;
  }, []);

  const appendMessage = useCallback(
    (message: AppendedMessage) => {
      const messagePrefix =
        message.kind === 'text' ? message.from : message.card.type;

      dispatch({
        type: 'APPEND_MESSAGE',
        payload: {
          ...message,
          id: createMessageId(messagePrefix),
        },
      });
    },
    [createMessageId, dispatch]
  );

  const appendText = useCallback(
    (text: string, from: 'ai' | 'user') => {
      appendMessage({ from, kind: 'text', text });
    },
    [appendMessage]
  );

  const appendCard = useCallback(
    (card: OnboardingCard) => {
      appendMessage({ from: 'ai', kind: 'card', card });
    },
    [appendMessage]
  );

  return {
    appendMessage,
    appendText,
    appendCard,
  };
}
