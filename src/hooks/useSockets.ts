import { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { envs } from "../envs/index.env";
import { v4 as uuidv4 } from "uuid"; // for userId

export const useProductSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const userIdRef = useRef(localStorage.getItem("chat_userId") || uuidv4());

  useEffect(() => {
    localStorage.setItem("chat_userId", userIdRef.current);

    if (!socketRef.current) {
      socketRef.current = io(`${envs.BACKEND_URL}/products`);
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, userId: userIdRef.current };
};

export const useOrderSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const userIdRef = useRef(localStorage.getItem("chat_userId") || uuidv4());

  useEffect(() => {
    localStorage.setItem("chat_userId", userIdRef.current);

    if (!socketRef.current) {
      socketRef.current = io(`${envs.BACKEND_URL}/orders`);
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { socket: socketRef.current, userId: userIdRef.current };
};
