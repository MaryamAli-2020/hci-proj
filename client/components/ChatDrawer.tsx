import { useEffect, useRef, useState } from "react";
import { X, Send, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiAssistantResponse, LawReference } from "@shared/api";
import type { Law } from "@shared/laws";
import { useNavigate } from "react-router-dom";

// Markdown renderer component
function MarkdownContent({ text, references }: { text: string; references?: LawReference[] }) {
  const navigate = useNavigate();
  
  // Parse text to handle bold, links, and law references
  const renderMarkdown = (content: string) => {
    // First split by newlines to preserve line breaks
    const lines = content.split('\n');
    
    return lines.map((line, lineIdx) => {
      // Split by bold pattern **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      
      const renderedParts = parts.map((part, idx) => {
        // Handle bold text
        if (part.startsWith("**") && part.endsWith("**")) {
          const boldText = part.slice(2, -2);
          return <strong key={idx}>{boldText}</strong>;
        }
        
        // Handle law references [lawid]
        if (part.match(/\[([a-z]+-\d+)\]/gi)) {
          const subParts = part.split(/(\[[a-z]+-\d+\])/gi);
          return subParts.map((subPart, subIdx) => {
            const refMatch = subPart.match(/\[([a-z]+-\d+)\]/i);
            if (refMatch) {
              const lawId = refMatch[1].toLowerCase();
              const reference = references?.find(r => r.lawId === lawId);
              return (
                <button
                  key={`${idx}-${subIdx}`}
                  onClick={() => navigate(`/law/${lawId}`)}
                  className="inline text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                  title={reference?.title}
                >
                  [{lawId}]
                </button>
              );
            }
            return subPart;
          });
        }
        
        return part;
      });
      
      return (
        <div key={lineIdx} className="whitespace-pre-wrap">
          {renderedParts}
        </div>
      );
    });
  };
  
  return <div className="text-sm leading-relaxed">{renderMarkdown(text)}</div>;
}

// Mock response generator (fallback when API is not available)
function generateMockResponse(question: string): AiAssistantResponse {
  const lowerQuestion = question.toLowerCase();
  let answer = "";
  
  if (lowerQuestion.includes("business") || lowerQuestion.includes("start")) {
    answer = `To start a business in Dubai, you need to follow these steps:

1. **Choose a Business Structure**: Decide between Free Zone Company, Mainland Company, or Offshore Company
2. **Select a Trade Name**: Choose a unique business name registered with the Department of Commerce
3. **Obtain a Trade License**: Apply through the Department of Commerce and Tourism (DCAT)
4. **Get Required Approvals**: Obtain sector-specific approvals if needed
5. **Register with Authorities**: Register with DEWA, Municipality, and other relevant authorities
6. **Open a Bank Account**: Open a corporate bank account with required documentation

The process typically takes 1-2 weeks. Dubai offers various incentives including 100% foreign ownership in Free Zones, corporate tax exemptions in certain sectors, and modern infrastructure.`;
  } else if (lowerQuestion.includes("labor") || lowerQuestion.includes("employee")) {
    answer = `UAE Labour Law provides comprehensive protections for both employers and employees:

Key provisions include:
- **Working Hours**: Maximum 48 hours per week
- **Leave**: Minimum 30 days annual leave
- **End of Service Benefits**: Employees are entitled to gratuity
- **Health and Safety**: Employers must maintain safe working conditions
- **Termination**: Specific procedures must be followed

Disputes are resolved through the UAE Labour Courts. Both local and expatriate workers enjoy equal legal protections under UAE Labour Law.`;
  } else if (lowerQuestion.includes("contract") || lowerQuestion.includes("agreement")) {
    answer = `UAE Civil Law governs contracts and agreements. Key principles include:

- **Offer and Acceptance**: Parties must clearly express their intent
- **Consideration**: Something of value must be exchanged
- **Capacity**: Parties must be legally competent to enter contracts
- **Legality**: Contract purpose must be legal
- **Consent**: Agreement must be free from duress

Contracts can be verbal or written. Written contracts are preferred for commercial transactions. UAE courts enforce contracts according to the parties' intentions and local law principles.`;
  } else {
    answer = `Thank you for your question about UAE law. Based on your inquiry and our available legal resources, I've compiled relevant information and references for you.

To get the most accurate legal guidance, I recommend:
1. Consulting with a qualified UAE legal professional
2. Reviewing the official government websites (DCAT, DEWA, etc.)
3. Checking the specific legal text applicable to your situation`;
  }

  return {
    answer,
    references: []
  };
}

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
  const navigate = useNavigate();
  
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
      const requestBody: any = { question: input };
      if (contextLaw) {
        requestBody.contextLaw = {
          id: contextLaw.id,
          title: contextLaw.title,
          content: contextLaw.content,
          legalReference: contextLaw.legalReference,
        };
      }

      let data: AiAssistantResponse | null = null;

      try {
        const response = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (fetchError) {
        // API not available, will use mock response below
        console.warn("API endpoint not available, using mock response");
      }

      // If API call failed or wasn't available, use mock response
      if (!data) {
        data = generateMockResponse(input);
      }

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
        <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gradient-to-r from-amber-50 to-amber-100">
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
                    ? "bg-amber-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                <div className={message.sender === "user" ? "text-white" : "text-gray-900"}>
                  {message.sender === "user" ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  ) : (
                    <MarkdownContent text={message.text} references={message.references} />
                  )}
                </div>

                {/* Law References */}
                {message.references && message.references.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                    <p className="text-xs font-semibold text-gray-700">
                      Legal References:
                    </p>
                    {message.references.map((ref) => (
                      <button
                        key={ref.lawId}
                        onClick={() => navigate(`/law/${ref.lawId}`)}
                        className="w-full text-left text-xs bg-white/50 hover:bg-white/80 transition-colors p-2 rounded border-l-2 border-amber-500 cursor-pointer hover:shadow-md"
                        type="button"
                      >
                        <p className="font-semibold text-blue-600 hover:text-blue-800">
                          {ref.title}
                        </p>
                        <p className="text-gray-700 mt-1">
                          <strong>Citation:</strong> {ref.legalReference}
                        </p>
                        <p className="text-gray-600 mt-1 italic">
                          {ref.excerpt}...
                        </p>
                      </button>
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
              className="bg-amber-600 hover:bg-amber-700 text-white"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 flex-shrink-0" />
            This AI references actual UAE laws. Always consult a licensed
            attorney for legal advice.
          </p>
        </div>
      </div>
    </>
  );
}
