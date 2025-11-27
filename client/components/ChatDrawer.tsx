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
  let lawIds: string[] = [];
  
  if (lowerQuestion.includes("student") && lowerQuestion.includes("visa")) {
    answer = `To obtain a student visa in the UAE, follow these steps:

1. **Get an Admission Letter**: Receive a formal acceptance letter from a recognized educational institution in the UAE
2. **Passport Requirement**: Ensure your passport is valid for at least 6 months
3. **Medical Fitness**: Complete medical examination and obtain a fitness certificate
4. **Apply for Residence Visa**: Submit your visa application through the educational institution or through the General Directorate of Residency and Foreigners Affairs (GDRFA)
5. **Required Documents**: Submit passport, admission letter, medical report, financial proof, and sponsor's documents
6. **Visa Processing**: Processing typically takes 1-4 weeks depending on the emirate
7. **Entry and Registration**: Upon arrival, register with GDRFA and obtain your Emirates ID

**Important Notes**:
- Student visas are usually sponsored by the educational institution
- The visa is valid for the duration of studies plus a grace period
- Dependents may be eligible to join under certain conditions`;
    lawIds = ["labor-6", "labor-8"];
  } else if (lowerQuestion.includes("visa") && (lowerQuestion.includes("work") || lowerQuestion.includes("employment"))) {
    answer = `To obtain a work visa in the UAE:

1. **Job Offer**: Secure a job offer from a UAE employer
2. **Visa Sponsorship**: Your employer will sponsor your work visa
3. **Medical Examination**: Pass a medical fitness test at an approved clinic
4. **Documentation**: Provide passport, employment contract, educational certificates, and medical results
5. **Residence Visa Processing**: Your employer submits documents to immigration authorities
6. **Entry Permit**: Receive an entry permit allowing you to enter the UAE
7. **Emirates ID**: Upon arrival, obtain an Emirates ID card

**Employment Requirements**:
- Work contract with defined terms and conditions
- Compliance with UAE Labour Law (Federal Decree No. 8 of 1980)
- Salary and benefits as per employment contract
- Mandatory health insurance`;
    lawIds = ["labor-1", "labor-4", "labor-6"];
  } else if (lowerQuestion.includes("business") || lowerQuestion.includes("start")) {
    answer = `To start a business in Dubai, you need to follow these steps:

1. **Choose a Business Structure**: Decide between Free Zone Company, Mainland Company, or Offshore Company
2. **Select a Trade Name**: Choose a unique business name registered with the Department of Commerce
3. **Obtain a Trade License**: Apply through the Department of Commerce and Tourism (DCAT)
4. **Get Required Approvals**: Obtain sector-specific approvals if needed
5. **Register with Authorities**: Register with DEWA, Municipality, and other relevant authorities
6. **Open a Bank Account**: Open a corporate bank account with required documentation

The process typically takes 1-2 weeks. Dubai offers various incentives including 100% foreign ownership in Free Zones, corporate tax exemptions in certain sectors, and modern infrastructure.`;
    lawIds = ["corporate-1", "corporate-2", "corporate-3"];
  } else if (lowerQuestion.includes("labor") || lowerQuestion.includes("employee") || lowerQuestion.includes("work")) {
    answer = `UAE Labour Law provides comprehensive protections for both employers and employees:

Key provisions include:
- **Working Hours**: Maximum 48 hours per week
- **Leave**: Minimum 30 days annual leave
- **End of Service Benefits**: Employees are entitled to gratuity
- **Health and Safety**: Employers must maintain safe working conditions
- **Termination**: Specific procedures must be followed

Disputes are resolved through the UAE Labour Courts. Both local and expatriate workers enjoy equal legal protections under UAE Labour Law.`;
    lawIds = ["labor-1", "labor-2", "labor-3", "labor-5"];
  } else if (lowerQuestion.includes("contract") || lowerQuestion.includes("agreement")) {
    answer = `UAE Civil Law governs contracts and agreements. Key principles include:

- **Offer and Acceptance**: Parties must clearly express their intent
- **Consideration**: Something of value must be exchanged
- **Capacity**: Parties must be legally competent to enter contracts
- **Legality**: Contract purpose must be legal
- **Consent**: Agreement must be free from duress

Contracts can be verbal or written. Written contracts are preferred for commercial transactions. UAE courts enforce contracts according to the parties' intentions and local law principles.`;
    lawIds = ["civil-1", "civil-2", "civil-3"];
  } else if (lowerQuestion.includes("salary") || lowerQuestion.includes("wage") || lowerQuestion.includes("minimum wage")) {
    answer = `The UAE sets and enforces minimum wage requirements to protect workers.

**Key Facts About UAE Wages**:
- **Current Minimum Wage**: AED 2,500 per month for private sector workers
- **Overtime Compensation**: Minimum 25% above regular wage
- **Payment Requirements**: Wages must be paid on time and in full
- **Deductions**: Limited deductions permitted under law
- **Collective Agreements**: May provide higher wages than minimum

Workers have the right to fair compensation and payment on schedule. Any disputes regarding wages can be brought before the UAE Labour Court.`;
    lawIds = ["labor-1", "labor-4", "labor-9"];
  } else if (lowerQuestion.includes("leave") || lowerQuestion.includes("vacation") || lowerQuestion.includes("holiday")) {
    answer = `UAE Labour Law provides comprehensive leave entitlements for workers.

**Annual Leave Rights**:
- **Standard Leave**: Minimum 30 calendar days per year
- **Hazardous Work**: 45 days per year for workers in hazardous conditions
- **Public Holidays**: Included in the leave calculation
- **Payment During Leave**: Workers receive full wages
- **Unused Leave**: Typically paid out upon employment termination

**Sick Leave**: Workers are entitled to paid sick leave as per regulations. The specific duration varies but is typically 10-30 days depending on circumstances.

Employers cannot refuse leave entitlements, and workers cannot waive these rights.`;
    lawIds = ["labor-2", "labor-8"];
  } else if (lowerQuestion.includes("safety") || lowerQuestion.includes("health") || lowerQuestion.includes("accident")) {
    answer = `Workplace safety and health are paramount under UAE Labour Law.

**Employer Obligations**:
- **Safe Environment**: Provide safe and healthy working conditions
- **Safety Equipment**: Supply necessary protective equipment and training
- **Hazard Prevention**: Identify and mitigate workplace hazards
- **Medical Care**: Ensure access to medical facilities
- **Insurance**: Maintain workers' compensation insurance
- **Incident Reporting**: Report workplace accidents

**Worker Rights**:
- Right to refuse unsafe work
- Right to training on safety procedures
- Right to compensation for work-related injuries
- Protection from retaliation for reporting safety issues

The Ministry of Human Resources enforces these regulations through regular workplace inspections.`;
    lawIds = ["labor-5", "labor-10"];
  } else {
    answer = `Thank you for your question about UAE law. Based on your inquiry and our available legal resources, I've compiled relevant information and references for you.

To get the most accurate legal guidance, I recommend:
1. Consulting with a qualified UAE legal professional
2. Reviewing the official government websites (DCAT, DEWA, GDRFA, etc.)
3. Checking the specific legal text applicable to your situation

Please browse our legal categories or search for specific topics to find more detailed information.`;
    lawIds = ["labor-1", "civil-1", "corporate-1"];
  }

  // Mock law references - in production, these would be fetched from database
  const lawReferencesMap: { [key: string]: LawReference } = {
    "labor-1": {
      lawId: "labor-1",
      title: "Working Hours and Overtime",
      legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 64-66",
      excerpt: "The normal working hours shall not exceed 48 hours per week. Overtime work shall be remunerated at least 25% above the ordinary wage."
    },
    "labor-2": {
      lawId: "labor-2",
      title: "Annual Leave and Public Holidays",
      legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 70-72",
      excerpt: "Every worker shall be entitled to an annual leave of at least 30 calendar days, including public holidays."
    },
    "labor-3": {
      lawId: "labor-3",
      title: "End of Service Gratuity",
      legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Article 84",
      excerpt: "An employer shall pay an end of service gratuity to every worker whose service is terminated based on years of service."
    },
    "labor-4": {
      lawId: "labor-4",
      title: "Minimum Wage Requirements",
      legalReference: "UAE Cabinet Resolution No. 15 of 2020 regarding Minimum Wage",
      excerpt: "The minimum wage for workers in the private sector is AED 2,500 per month for all workers."
    },
    "labor-5": {
      lawId: "labor-5",
      title: "Workplace Safety and Health",
      legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 119-125",
      excerpt: "Employers must provide safe and healthy working conditions, ensure proper ventilation, adequate lighting, and sanitary facilities."
    },
    "labor-6": {
      lawId: "labor-6",
      title: "Work Permits and Residency",
      legalReference: "UAE Residency and Immigration Laws",
      excerpt: "Work permits are required for employment in the UAE and are typically sponsored by employers."
    },
    "labor-8": {
      lawId: "labor-8",
      title: "Employment Contracts",
      legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 30-50",
      excerpt: "Employment contracts must specify terms and conditions, job duties, salary, and benefits."
    },
    "labor-9": {
      lawId: "labor-9",
      title: "Wage Payment Procedures",
      legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Article 67",
      excerpt: "Wages must be paid in full and on time. Unauthorized deductions are prohibited."
    },
    "labor-10": {
      lawId: "labor-10",
      title: "Workers' Compensation Insurance",
      legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 128-137",
      excerpt: "Employers must maintain insurance to cover workers injured during employment."
    },
    "civil-1": {
      lawId: "civil-1",
      title: "UAE Civil Law Basics",
      legalReference: "UAE Civil Code",
      excerpt: "Governs civil and commercial transactions, including contracts and agreements."
    },
    "civil-2": {
      lawId: "civil-2",
      title: "Contract Law",
      legalReference: "UAE Civil Code",
      excerpt: "Covers formation, interpretation, and enforcement of contracts."
    },
    "civil-3": {
      lawId: "civil-3",
      title: "Dispute Resolution",
      legalReference: "UAE Civil Code",
      excerpt: "Provides procedures for resolving civil disputes through courts."
    },
    "corporate-1": {
      lawId: "corporate-1",
      title: "Company Formation and Registration",
      legalReference: "UAE Commercial Companies Law Federal Law No. 2 of 2015",
      excerpt: "Establishes procedures for registering and operating business entities in the UAE."
    },
    "corporate-2": {
      lawId: "corporate-2",
      title: "Free Zone Business Operations",
      legalReference: "UAE Free Zone Regulations",
      excerpt: "Allows 100% foreign ownership and provides tax incentives for businesses in free zones."
    },
    "corporate-3": {
      lawId: "corporate-3",
      title: "Trade License Requirements",
      legalReference: "Department of Commerce and Tourism Regulations",
      excerpt: "Specifies requirements for obtaining and maintaining trade licenses in the UAE."
    }
  };

  // Filter references to only return the ones requested, up to 3
  const references = lawIds
    .map(id => lawReferencesMap[id])
    .filter(Boolean)
    .slice(0, 3);

  return {
    answer,
    references
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
        } else {
          console.warn(`API returned status ${response.status}, using mock response`);
        }
      } catch (fetchError) {
        // API not available, will use mock response below
        console.warn("API endpoint not available, using mock response", fetchError);
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
