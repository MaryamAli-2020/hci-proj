import { RequestHandler } from "express";
import { laws } from "../../shared/laws";

interface AiAssistantRequest {
  question: string;
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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

export const handleAiAssistant: RequestHandler = async (req, res) => {
  try {
    const { question } = req.body as AiAssistantRequest;

    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "Question is required" });
      return;
    }

    if (!GEMINI_API_KEY) {
      res.status(500).json({ error: "AI service not configured" });
      return;
    }

    // Prepare the laws context for Gemini
    const lawsContext = laws
      .map(
        (law) =>
          `ID: ${law.id}
Title: ${law.title}
Legal Reference: ${law.legalReference}
Content: ${law.content}
Keywords: ${law.keywords.join(", ")}
---`
      )
      .join("\n\n");

    const systemPrompt = `You are a specialized UAE legal assistant. You have access to comprehensive UAE law information. When answering questions:

1. ALWAYS cite the exact law reference (e.g., "Federal Law No. X of XXXX, Article Y")
2. Quote relevant sections verbatim when applicable
3. Provide accurate information based ONLY on the laws provided
4. Include the law ID from the database in your response in square brackets like [law-id]
5. For every law you mention, include its ID in square brackets immediately after citing it
6. If a question falls outside the provided laws, clearly state that information is not available in the system

Here is the UAE legal database you should reference:

${lawsContext}

Important Rules:
- NEVER modify or paraphrase law text - use exact quotes when possible
- ALWAYS include the legal reference for every law mentioned
- Format references clearly with law IDs for tracking: [law-id]
- If multiple laws apply, reference all of them with their IDs
- Be specific about article numbers and sections
- Provide practical guidance based on actual UAE law
- When you reference a law, place its ID in square brackets like this: [labor-1], [civil-2], etc.`;

    const userMessage = `Question about UAE Law: ${question}

Please provide a detailed answer citing the exact laws and articles that apply to this question. Include the law IDs in square brackets.`;

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: {
            text: systemPrompt,
          },
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: userMessage,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
      return;
    }

    const data = await response.json();
    const aiAnswer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate response";

    // Extract law references from the answer
    const references = extractLawReferences(aiAnswer, laws);

    const result: AiAssistantResponse = {
      answer: aiAnswer,
      references: references,
    };

    res.json(result);
  } catch (error) {
    console.error("AI Assistant error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function extractLawReferences(
  answer: string,
  lawsDatabase: typeof laws
): AiAssistantResponse["references"] {
  const references: AiAssistantResponse["references"] = [];
  const lawIdRegex = /\[([a-z]+-\d+)\]/gi;
  const matches = answer.matchAll(lawIdRegex);

  const seenLawIds = new Set<string>();

  for (const match of matches) {
    const lawId = match[1].toLowerCase();

    if (!seenLawIds.has(lawId)) {
      const law = lawsDatabase.find((l) => l.id === lawId);
      if (law) {
        references.push({
          lawId: law.id,
          title: law.title,
          legalReference: law.legalReference,
          excerpt: law.content.substring(0, 200),
        });
        seenLawIds.add(lawId);
      }
    }
  }

  return references;
}
