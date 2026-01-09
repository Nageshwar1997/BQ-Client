import { useState, useRef, useEffect } from "react";
import { BotIcon, CloseIcon, DropdownIcon, NavigationIcon } from "../../icons";
import Button from "../button/Button";
import useOutsideClick from "../../hooks/useOutsideClick";
import Input from "../input/Input";
import MarkdownDisplay from "./MarkdownDisplay";
import { TChatData, TChatMessage } from "../../types";
import { useSocket } from "../../hooks/useSocket";
import useRequireAuth from "../../hooks/useRequireAuth";
import useQueryParams from "../../hooks/useQueryParams";
import { CHAT_DEFAULT_DATA } from "../../constants";
import usePathParams from "../../hooks/usePathParams";

const Chatbot = () => {
  const { queryParams } = useQueryParams();
  const { paths } = usePathParams();
  const [context, setContext] = useState<TChatData["context"] | null>(null);
  const { socket, connected, userId } = useSocket(context);
  const requireAuth = useRequireAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const outsideClickRef = useOutsideClick<HTMLDivElement>(
    () => setIsOpen(false),
    { enabled: isOpen }
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Streamed toke/chunks from AI
    const handleChunk = ({ chunk }: { chunk: string }) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];

        // If last is bot → append chunk
        if (last?.type === "bot") {
          return [...prev.slice(0, -1), { ...last, text: last.text + chunk }];
        }

        // First chunk from bot
        return [...prev, { id: Date.now(), type: "bot", text: chunk }];
      });
    };

    // Final AI response + suggested questions
    const handleComplete = ({
      fullResponse,
      suggestedQuestions,
    }: {
      fullResponse: string;
      suggestedQuestions: string[];
    }) => {
      setTyping(false);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        updated[updated.length - 1] = {
          ...last,
          text: fullResponse,
          suggestedQuestions,
        };
        return updated;
      });
    };

    // Error messages
    const handleError = ({ error }: { error: string }) => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: "error", text: error },
      ]);
    };

    // Attach listeners
    socket.on("receive_message_chunk", handleChunk);
    socket.on("receive_message_complete", handleComplete);
    socket.on("receive_message", handleError);

    // Cleanup on unmount or socket change
    return () => {
      socket.off("receive_message_chunk", handleChunk);
      socket.off("receive_message_complete", handleComplete);
      socket.off("receive_message", handleError);
    };
  }, [socket]);

  // Auto scroll down
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // SEND MESSAGE
  const handleSend = (msgText?: string) => {
    const textToSend = msgText || input;
    if (!textToSend.trim() || !socket) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: textToSend },
    ]);
    setInput("");
    setTyping(true);

    if (connected) {
      socket.emit("send_message", { message: textToSend, userId });
    } else {
      // Wait for connection before sending
      const onConnect = () => {
        socket.emit("send_message", { message: textToSend, userId });
        socket.off("connect", onConnect);
      };
      socket.on("connect", onConnect);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const isAccountPage = paths.includes("account");
  return (
    <div
      ref={queryParams.login ? null : outsideClickRef}
      className={`fixed right-3 ${
        isAccountPage ? "bottom-16 sm:bottom-3" : "bottom-3"
      } z-50`}
    >
      {!isOpen ? (
        <Button
          content={
            <BotIcon className="stroke-white w-4 md:w-6 lg:w-8 h-4 md:h-6 lg:h-8" />
          }
          className="rounded-full! p-2! md:p-2.5! lg:p-3!"
          pattern="primary"
          buttonProps={{ onClick: () => setIsOpen(true) }}
        />
      ) : (
        <div className="bg-primary-inverted rounded-xl shadow-light-dark-soft flex flex-col w-80 sm:w-96 h-[70dvh] overflow-hidden border border-primary-30">
          {/* HEADER */}
          <div className="bg-accent-duo text-white flex items-center justify-between p-4">
            <DropdownIcon
              stroke="white"
              className="w-8 h-8 rotate-90 cursor-pointer"
              onClick={() => {
                setContext(null);
                setInput("");
                setMessages([]);
                setTyping(false);
              }}
            />
            <h2 className="font-bold text-lg">BQ Chatbot</h2>
            <CloseIcon
              stroke="white"
              strokeWidth="3"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            />
          </div>
          {/* BODY */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {context ? (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div
                      className={`p-2 rounded max-w-[80%] w-fit animate-slide-in text-sm/5 ${
                        msg.type === "user"
                          ? "bg-tertiary-inverted-30 text-primary ml-auto"
                          : msg.type === "bot"
                          ? "bg-tertiary-inverted-50 text-primary"
                          : "bg-red-100 text-red-900"
                      }`}
                    >
                      <MarkdownDisplay text={msg.text} />
                    </div>
                    {msg.suggestedQuestions &&
                      msg.suggestedQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestedQuestions.map((q, i) => (
                            <Button
                              key={i}
                              pattern="outline"
                              content={q}
                              className="bg-tertiary-inverted-50 text-tertiary text-[13px]/4! p-2! max-w-[80%] rounded-sm! border-tertiary-30! [&_span]:text-start [&_span]:wrap-break-word transition-none justify-start!"
                              buttonProps={{
                                onClick: () => handleSuggestionClick(q),
                              }}
                            />
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {typing && (
                  <div className="bg-tertiary-inverted text-primary text-sm/5 p-2 rounded-lg w-fit animate-pulse">
                    Thinking...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            ) : (
              // CONTEXT SELECTION
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-primary md:text-lg max-w-xs text-center font-semibold text-shadow-sm">
                  What would you like to ask our chatbot?
                </p>
                <hr className="w-full h-px block border-none bg-gradient-line" />
                <div className="space-y-3">
                  {CHAT_DEFAULT_DATA.map((item) => {
                    return (
                      <button
                        key={item.context}
                        className="w-full border border-primary-30 bg-primary-10 rounded-lg p-2 flex flex-col justify-start text-start"
                        onClick={() => {
                          const action = () => {
                            setContext(item.context);
                            setMessages([
                              {
                                id: Date.now(),
                                type: "bot",
                                text: item.message,
                                suggestedQuestions: item.suggestions,
                              },
                            ]);
                          };

                          if (item.context === "orders") {
                            if (!requireAuth(action)) return;
                            action();
                          } else {
                            action();
                          }
                        }}
                      >
                        <p className="text-sm md:text-base bg-clip-text bg-silver-duo text-transparent font-medium capitalize">
                          {item.context}:
                        </p>
                        <p className="text-xs md:text-sm mt-1  text-silver-jet-2">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* INPUT */}
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              needRef={true}
              inputProps={{
                id: "chat-input",
                name: "chat-input",
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder: "Ask about products...",
                onKeyDown: (e) => e.key === "Enter" && handleSend(),
                disabled: typing || !context,
              }}
              className="rounded-full!"
              containerClassName="[&>div]:h-10"
            />
            <Button
              buttonProps={{
                onClick: () => handleSend(),
                disabled: typing || !context,
              }}
              className="w-10! h-10! rounded-full! p-2!"
              pattern="primary"
              content={
                <NavigationIcon className="rotate-45 mr-1 stroke-white" />
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
