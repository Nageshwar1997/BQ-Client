import { useState, useRef, useEffect } from "react";
import { BotIcon, CloseIcon, DropdownIcon, NavigationIcon } from "../../icons";
import Button from "../button/Button";
import useOutsideClick from "../../hooks/useOutsideClick";
import Input from "../input/Input";
import MarkdownDisplay from "./MarkdownDisplay";
import { TChatMessage } from "../../types";
import { useProductSocket } from "../../hooks/useSockets";
import useRequireAuth from "../../hooks/useRequireAuth";
import useQueryParams from "../../hooks/useQueryParams";

const welcomeMessages: Record<string, string> = {
  products: "Welcome! Sir/Ma'am 👋 You can ask me anything about our products.",
  orders:
    "Hello! Sir/Ma'am 👋 I can help you check your orders and deliveries.",
};

const defaultSuggestedQuestions: Record<string, string[]> = {
  products: [
    "What are the best-selling products?",
    "Do you have any discounts currently?",
    "Tell me about the features of Product X",
  ],
  orders: [
    "Check my order status",
    "Track my recent delivery",
    "Cancel my order",
  ],
};

const Chatbot = () => {
  const { queryParams } = useQueryParams();
  const { socket, userId } = useProductSocket();
  const requireAuth = useRequireAuth();
  const [context, setContext] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const outsideClickContainerRef = useOutsideClick<HTMLDivElement>(
    () => setIsOpen(false),
    { enabled: isOpen }
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Streamed chunks from AI
    const handleChunk = ({ chunk }: { chunk: string }) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.type === "bot") {
          const updated = [...prev];
          updated[prev.length - 1] = { ...last, text: last.text + chunk };
          return updated;
        }
        return [...prev, { id: Date.now(), type: "bot", text: chunk }];
      });
    };

    // Full AI response + suggested questions
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
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: fullResponse,
        };
        return updated;
      });
      setSuggestedQuestions(suggestedQuestions);
    };

    // Error messages
    const handleError = ({ error }: { error: string }) => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: "error", text: error },
      ]);
    };

    socket.on("receive_message_chunk", handleChunk);
    socket.on("receive_message_complete", handleComplete);
    socket.on("receive_message", handleError);

    return () => {
      socket.off("receive_message_chunk", handleChunk);
      socket.off("receive_message_complete", handleComplete);
      socket.off("receive_message", handleError);
    };
  }, [socket]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, suggestedQuestions]);

  // Send message
  const handleSend = (msgText?: string) => {
    const textToSend = msgText || input;
    if (!textToSend.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: textToSend },
    ]);
    setInput("");
    setTyping(true);
    setSuggestedQuestions([]);

    socket?.emit("send_message", { message: textToSend, userId });
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div
      ref={queryParams.login ? null : outsideClickContainerRef}
      className="fixed bottom-3 right-3 z-50"
    >
      {!isOpen ? (
        <Button
          content={<BotIcon className="stroke-white w-full h-full" />}
          className="!rounded-full !p-3"
          pattern="primary"
          buttonProps={{ onClick: () => setIsOpen(true) }}
        />
      ) : (
        <div className="bg-primary-inverted rounded-xl shadow-xl flex flex-col w-80 sm:w-96 h-[70dvh] overflow-hidden">
          <div className="bg-accent-duo text-white flex items-center justify-between p-4">
            <DropdownIcon
              stroke="white"
              className="w-8 h-8 rotate-90 border border-[red]"
              onClick={() => {
                setContext(null);
                setInput("");
                setMessages([]);
                setSuggestedQuestions([]);
                setTyping(false);
              }}
            />
            <h2 className="font-bold text-lg">BQ Chatbot</h2>
            <CloseIcon
              stroke="white"
              strokeWidth="3"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {context ? (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded max-w-[80%] w-fit animate-slide-in text-sm/5 ${
                      msg.type === "user"
                        ? "bg-secondary-inverted text-tertiary ml-auto"
                        : msg.type === "bot"
                        ? "bg-tertiary-inverted text-primary"
                        : "bg-red-100 text-red-900"
                    }`}
                  >
                    <MarkdownDisplay text={msg.text} />
                  </div>
                ))}

                {typing && (
                  <div className="bg-tertiary-inverted text-primary text-sm/5 p-2 rounded-lg w-fit animate-pulse">
                    Thinking...
                  </div>
                )}

                {/* Suggested Questions */}
                {suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        pattern="outline"
                        content={q}
                        className="bg-tertiary-inverted-50 text-tertiary !text-[13px]/4 !p-2 max-w-[80%] !rounded !border-tertiary-30 [&_span]:text-start [&_span]:break-words transition-none !justify-start"
                        buttonProps={{
                          onClick: () => handleSuggestionClick(q),
                        }}
                      />
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-primary md:text-lg max-w-xs text-center font-semibold text-shadow-sm">
                  What would you like to ask our chatbot?
                </p>
                <hr className="w-full h-px block border-none bg-gradient-line" />
                <div className="space-y-3">
                  {[
                    {
                      name: "products",
                      description:
                        "Ask about our products, their features, and details.",
                    },
                    {
                      name: "orders",
                      description:
                        "Check your order status or track your deliveries.",
                    },
                  ].map((ctx, idx) => {
                    return (
                      <button
                        key={idx}
                        className="border border-primary-30 bg-primary-10 rounded-lg p-2"
                        onClick={() => {
                          const action = () => {
                            setContext(ctx.name);
                            // Show welcome message
                            setMessages([
                              {
                                id: Date.now(),
                                type: "bot",
                                text: welcomeMessages[ctx.name],
                              },
                            ]);
                            // Set default suggested questions
                            setSuggestedQuestions(
                              defaultSuggestedQuestions[ctx.name]
                            );
                          };

                          if (ctx.name === "orders") {
                            if (!requireAuth(action)) return;
                            action();
                          } else {
                            action();
                          }
                        }}
                      >
                        <p className="text-sm md:text-base bg-clip-text bg-silver-duo text-transparent font-medium capitalize">
                          {ctx.name}:
                        </p>
                        <p className="text-xs md:text-sm mt-1  text-silver-jet-2">
                          {ctx.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
              className="!rounded-full"
              containerClassName="[&>div]:h-10"
            />
            <Button
              buttonProps={{
                onClick: () => handleSend(),
                disabled: typing || !context,
              }}
              className="!w-10 !h-10 !rounded-full !p-2"
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
