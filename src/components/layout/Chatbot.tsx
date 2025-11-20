import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { BotIcon, CloseIcon, NavigationIcon } from "../../icons";
import { v4 as uuidv4 } from "uuid"; // for userId
import Button from "../button/Button";
import useOutsideClick from "../../hooks/useOutsideClick";

interface Message {
  id: number;
  type: "user" | "bot" | "error";
  text: string;
}

let socket: Socket;
const userId = localStorage.getItem("chat_userId") || uuidv4();
localStorage.setItem("chat_userId", userId);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const outsideClickContainerRef = useOutsideClick<HTMLDivElement>(
    () => setIsOpen(false),
    {
      enabled: isOpen,
    }
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket = io("http://localhost:8080/products"); // connect to products namespace

    // Streamed chunks from AI
    socket.on("receive_message_chunk", ({ success, chunk }) => {
      if (success) {
        // Append chunk to last bot message or create new
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.type === "bot") {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              text: last.text + chunk,
            };
            return updated;
          }
          return [...prev, { id: Date.now(), type: "bot", text: chunk }];
        });
      }
    });

    // Error messages
    socket.on(
      "receive_message",
      (data: { success: boolean; error: string }) => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), type: "error", text: data.error },
        ]);
      }
    );

    // Full response + suggested questions
    // Full response + suggested questions
    socket.on(
      "receive_message_complete",
      ({ fullResponse, suggestedQuestions }) => {
        setTyping(false);

        // Replace the streaming text with final clean answer
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: fullResponse,
          };
          return updated;
        });

        setSuggestedQuestions(suggestedQuestions);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  // Scroll to bottom when messages or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, suggestedQuestions]);

  const handleSend = (msgText?: string) => {
    const textToSend = msgText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    setSuggestedQuestions([]); // reset suggestions on new message

    // Send message to backend
    socket.emit("send_message", { message: textToSend, userId });
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div ref={outsideClickContainerRef} className="fixed bottom-3 right-3 z-50">
      {!isOpen ? (
        <Button
          content={<BotIcon className="stroke-white w-full h-full" />}
          className="!rounded-full !p-3"
          pattern="primary"
          buttonProps={{ onClick: () => setIsOpen(true) }}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-xl flex flex-col w-80 sm:w-96 h-[70dvh] overflow-hidden">
          <div className="bg-pink-500 text-white flex items-center justify-between p-4">
            <BotIcon className="stroke-white md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <h2 className="font-bold text-lg">BQ Chatbot</h2>
            <CloseIcon stroke="white" onClick={() => setIsOpen(false)} />
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg max-w-[75%] animate-slide-in ${
                  msg.type === "user"
                    ? "bg-pink-100 text-pink-800 ml-auto"
                    : msg.type === "bot"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className="bg-gray-100 text-gray-800 p-2 rounded-lg max-w-[40%] animate-pulse">
                Typing...
              </div>
            )}

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(q)}
                    className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 text-primary"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              className=" bg-pink-500 w-10 h-10 flex items-center justify-center p-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              <NavigationIcon className="rotate-45 mr-1 stroke-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
