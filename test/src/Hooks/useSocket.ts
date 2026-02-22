import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { BACKEND_URL } from '../Constants';
import type { IChatMessage } from '../Types';
import { Store } from '../Store';

export const useSocket = (context: IChatMessage['context'] | null) => {
  const { user } = Store.User();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState(() => sessionStorage.getItem('chat_userId') || uuidv4());

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('chat_userId', user._id);
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (!context) {
      setSocket(null);
      setConnected(false);
      return;
    }

    localStorage.setItem('chat_userId', userId);

    // Disconnect previous socket
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(`${BACKEND_URL}/${context}`, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  return { socket, connected, userId };
};
