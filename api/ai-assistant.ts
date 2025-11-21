import { VercelRequest, VercelResponse } from "@vercel/node";
import { laws } from "../shared/laws";

interface ContextLaw {
  id: string;
  title: string;
  content: string;
  legalReference: string;
}

interface AiAssistantRequest {
  question: string;
  contextLaw?: ContextLaw;
}

interface AiAssistantResponse {
  answer: string;
  references: Array<{
    lawId: string;
    title: string;
    legalReference: string;
    excerpt: string;
  }>;
}

// Mock AI response generator for demonstration
const generateMockResponse = (question: string): { answer: string; references: any[] } => {
  const lowerQuestion = question.toLowerCase();
  
  // Find relevant laws based on keywords
  let relevantLaws = laws.filter(law => {
    const content = `${law.title} ${law.description} ${law.content}`.toLowerCase();
    const keywords = lowerQuestion.split(' ').filter(w => w.length > 3);
    return keywords.some(keyword => content.includes(keyword));
  }).slice(0, 3);

  // If no relevant laws found, return general response
  if (relevantLaws.length === 0) {
    relevantLaws = laws.slice(0, 2);
  }

  let answer = "";
  
  if (lowerQuestion.includes("business") || lowerQuestion.includes("start")) {
    answer = `To start a business in Dubai, you need to follow these steps:

1. **Choose a Business Structure**: Decide between Free Zone Company, Mainland Company, or Offshore Company
2. **Select a Trade Name**: Choose a unique business name registered with the Department of Commerce
3. **Obtain a Trade License**: Apply through the Department of Commerce and Tourism (DCAT)
4. **Get Required Approvals**: Obtain sector-specific approvals if needed
5. **Register with Authorities**: Register with DEWA, Municipality, and other relevant authorities
6. **Open a Bank Account**: Open a corporate bank account with required documentation

The process typically takes 1-2 weeks. Dubai offers various incentives including 100% foreign ownership in Free Zones, corporate tax exemptions in certain sectors, and modern infrastructure.

For detailed information about specific business types and requirements, please refer to the related legal resources below.`;
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
3. Checking the specific legal text applicable to your situation

Please refer to the legal resources below for more detailed information.`;
  }

  return {
    answer,
    references: relevantLaws.map(law => ({
      lawId: law.id,
      title: law.title,
      legalReference: law.legalReference,
      excerpt: law.description
    }))
  };
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, contextLaw } = req.body as AiAssistantRequest;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    // Generate mock response (replace with actual AI service when API key is available)
    const mockResponse = generateMockResponse(question);
    
    const response: AiAssistantResponse = {
      answer: mockResponse.answer,
      references: mockResponse.references
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in AI assistant:", error);
    res.status(500).json({ 
      error: "Failed to process your question",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
