/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type MediaAttachment = {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  file?: File;
  outputKey?: string;
  generatedMediaId?: string;
};

export type Message = {
  id: string;
  role: 'user' | 'ai';
  kind?:
    | 'text'
    | 'status'
    | 'video-upload'
    | 'image-upload'
    | 'generation-choice'
    | 'generation-actions'
    | 'media-response';
  text: string;
  attachments?: MediaAttachment[];
  meta?: Record<string, unknown>;
  timestamp: Date;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

type ChatContextType = {
  chats: ChatSession[];
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: () => string;
  updateChatMessages: (chatId: string, messages: Message[]) => void;
  upsertChat: (chat: ChatSession) => void;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const createChatSession = (): ChatSession => ({
  id: crypto.randomUUID(),
  title: 'New Chat',
  messages: [],
  createdAt: new Date(),
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const initialChat = useMemo(() => createChatSession(), []);
  const [chats, setChats] = useState<ChatSession[]>([initialChat]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(
    initialChat.id
  );

  const createNewChat = () => {
    const chat = createChatSession();
    setChats((prev) => [chat, ...prev]);
    setCurrentChatId(chat.id);
    return chat.id;
  };

  const upsertChat = (chat: ChatSession) => {
    setChats((prev) => {
      const existingIndex = prev.findIndex((session) => session.id === chat.id);
      if (existingIndex === -1) return [chat, ...prev];
      return prev.map((session) =>
        session.id === chat.id ? { ...session, ...chat } : session
      );
    });
  };

  const updateChatMessages = (chatId: string, messages: Message[]) => {
    setChats((prev) =>
      prev.some((chat) => chat.id === chatId)
        ? prev.map((chat) => {
            if (chat.id === chatId) {
              const firstUserMessage = messages.find((m) => m.role === 'user');
              const newTitle =
                chat.title === 'New Chat' &&
                firstUserMessage?.text &&
                firstUserMessage.text.trim().length > 0
                  ? firstUserMessage.text.length > 40
                    ? firstUserMessage.text.slice(0, 40) + '...'
                    : firstUserMessage.text
                  : chat.title;
              return { ...chat, messages, title: newTitle };
            }
            return chat;
          })
        : [
            {
              id: chatId,
              title:
                messages.find((m) => m.role === 'user')?.text?.slice(0, 40) ||
                'New Chat',
              messages,
              createdAt: new Date(),
            },
            ...prev,
          ]
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        setCurrentChatId,
        createNewChat,
        updateChatMessages,
        upsertChat,
        isLoading: false,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
