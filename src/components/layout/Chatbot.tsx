import { useState, useRef, useEffect } from "react";
import { ChatIcon, CloseIcon, NavigationIcon } from "../../icons";

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when new message appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        text: `Thanks for reaching out! We love helping with beauty tips 💄✨`,
      };
      setMessages((prev) => [...prev, botMessage]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-end">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-rose-c p-2 md:p-3 lg:p-4 rounded-full shadow-lg hover:scale-110 transform transition-transform duration-300 absolute bottom-0 left-0"
        >
          <ChatIcon className="fill-white md:w-7 md:h-7 lg:w-8 lg:h-8" />
        </button>
      )}

      {/* Chat Window */}
      <div
        className={`bg-white rounded-xl shadow-xl flex flex-col overflow-hidden transform transition-all duration-500 ${
          isOpen
            ? "scale-100 opacity-100 w-80 h-96"
            : "scale-0 opacity-0 w-0 h-0"
        }`}
      >
        {/* Header */}
        <div className="bg-pink-500 text-white flex items-center justify-between p-4">
          <h2 className="font-bold text-lg">Beautinique Assistant</h2>
          <button onClick={() => setIsOpen(false)}>
            <CloseIcon stroke="white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-lg max-w-[75%] animate-slide-in ${
                msg.type === "user"
                  ? "bg-pink-100 text-pink-800 ml-auto"
                  : "bg-gray-100 text-gray-800"
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className=" bg-pink-500 w-10 h-10 flex items-center justify-center text-white p-2 rounded-full hover:bg-pink-600 transition-colors"
          >
            <NavigationIcon className="rotate-45 mr-1 stroke-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
