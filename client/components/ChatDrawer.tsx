import { useEffect, useRef, useState } from "react";
import { X, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiAssistantResponse, LawReference } from "@shared/api";
import type { Law } from "@shared/laws";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  references?: LawReference[];
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextLaw?: Law;
}

export function ChatDrawer({ isOpen, onClose, contextLaw }: ChatDrawerProps) {
  const getInitialMessage = (): string => {
    if (contextLaw) {
      return `Assalamu Alaikum! 👋 I see you're reading about "${contextLaw.title}". I'm your UAE Legal AI Assistant. I can help you understand this law in detail, answer specific questions about it, or connect it to related laws. What would you like to know?`;
    }
    return "Assalamu Alaikum! 👋 I'm your UAE Legal AI Assistant. I can help you understand UAE laws and regulations across multiple practice areas including Labour Law, Civil Law, Criminal Law, Family Law, Corporate Law, and Intellectual Property. Ask me any question about UAE law and I'll provide you with exact legal references.";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: getInitialMessage(),
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI assistant");
      }

      const data: AiAssistantResponse = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: "ai",
        timestamp: new Date(),
        references: data.references,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);

      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I apologize, but I encountered an error processing your question. ${errorMessage}. Please try again or rephrase your question.`,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col transition-transform"
        role="dialog"
        aria-labelledby="chat-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
          <div>
            <h2
              id="chat-title"
              className="font-semibold text-lg text-gray-900"
            >
              UAE Legal Assistant
            </h2>
            <p className="text-xs text-gray-600 mt-1">Powered by Gemini AI</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
                role={message.sender === "user" ? "listitem" : "article"}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>

                {/* Law References */}
                {message.references && message.references.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                    <p className="text-xs font-semibold text-gray-700">
                      Legal References:
                    </p>
                    {message.references.map((ref) => (
                      <div
                        key={ref.lawId}
                        className="text-xs bg-white/50 p-2 rounded border-l-2 border-blue-500"
                      >
                        <p className="font-semibold text-gray-800">
                          {ref.title}
                        </p>
                        <p className="text-gray-700 mt-1">
                          <strong>Citation:</strong> {ref.legalReference}
                        </p>
                        <p className="text-gray-600 mt-1 italic">
                          {ref.excerpt}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <span
                  className={`text-xs mt-2 block ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask about UAE law..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              aria-label="Type your question"
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            💡 This AI references actual UAE laws. Always consult a licensed
            attorney for legal advice.
          </p>
        </div>
      </div>
    </>
  );
}
