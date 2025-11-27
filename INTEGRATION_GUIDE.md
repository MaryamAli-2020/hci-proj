# Integration Guide - Advanced AI Assistant Features

## Overview

This guide shows how to integrate the newly created advanced NLP services into the existing ChatDrawer component and AI assistant endpoint.

---

## Step 1: Update the AI Assistant API Endpoint

**File**: `server/routes/ai-assistant.ts`

```typescript
import { RequestHandler } from "express";
import { laws } from "../../shared/laws";
import { IntentClassifier, type Intent } from "../services/intent-classifier";
import {
  EntityExtractor,
  type ExtractedEntities,
} from "../services/entity-extractor";
import {
  ConfidenceScorer,
  type ResponseConfidence,
} from "../services/confidence-scorer";
import { GlossaryService } from "../../shared/glossary";

interface AiAssistantRequest {
  question: string;
  contextLaw?: {
    id: string;
    title: string;
    content: string;
    legalReference: string;
  };
  userExpertiseLevel?: "beginner" | "intermediate" | "expert";
}

interface AiAssistantResponse {
  answer: string;
  references: Array<{
    lawId: string;
    title: string;
    legalReference: string;
    excerpt: string;
  }>;
  intent: Intent;
  entities: ExtractedEntities;
  confidence: ResponseConfidence;
  termDefinitions: Array<{
    term: string;
    definition: string;
    arabicDefinition: string;
  }>;
  relatedQuestions?: string[];
}

export const handleAiAssistant: RequestHandler = async (req, res) => {
  try {
    const {
      question,
      contextLaw,
      userExpertiseLevel = "beginner",
    } = req.body as AiAssistantRequest;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Question is required and must be a string",
      });
    }

    // Step 1: Classify intent
    const intent = IntentClassifier.classify(question);

    // Step 2: Extract entities
    const entities = EntityExtractor.extract(question);

    // Step 3: Find relevant laws
    const selectedLawIds = this.getLawsForCategory(intent.category);
    const foundLaws = selectedLawIds
      .map((id) => laws.find((law) => law.id === id))
      .filter(Boolean) as typeof laws;

    // Step 4: Generate response based on intent
    const answer = this.generateResponse(
      question,
      intent,
      foundLaws,
      userExpertiseLevel,
      contextLaw,
    );

    // Step 5: Score confidence
    const responseConfidence = ConfidenceScorer.scoreResponse(
      question,
      foundLaws.map((law) => ({
        id: law.id,
        score: 0.85, // In production, calculate based on relevance
        lastUpdated: law.lastUpdated,
      })),
      {
        hasDirectMatch: intent.confidence > 0.8,
        hasSemanticMatch: intent.confidence > 0.5,
        multipleMatches: foundLaws.length > 1,
        citationsProvided: true,
        disclaimerIncluded: true,
      },
    );

    // Step 6: Extract term definitions
    const termDefinitions = entities.keyTerms
      .map((term) => {
        const definition = GlossaryService.getDefinition(term);
        return definition
          ? {
              term: definition.term,
              definition: definition.definition,
              arabicDefinition: definition.arabicDefinition,
            }
          : null;
      })
      .filter(Boolean);

    // Step 7: Generate related questions
    const relatedQuestions = this.generateRelatedQuestions(intent, foundLaws);

    // Step 8: Format response
    const response: AiAssistantResponse = {
      answer,
      references: foundLaws.map((law) => ({
        lawId: law.id,
        title: law.title,
        legalReference: law.legalReference,
        excerpt: law.description,
      })),
      intent,
      entities,
      confidence: responseConfidence,
      termDefinitions: termDefinitions as any[],
      relatedQuestions,
    };

    // Handle confidence levels
    if (!ConfidenceScorer.isSuitableForHighStakes(responseConfidence)) {
      response.answer += `\n\n⚠️ **Note**: ${responseConfidence.disclaimers.join(" ")}`;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in AI assistant:", error);
    res.status(500).json({
      error: "Failed to process your question",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper methods
const aiAssistantHandler = {
  getLawsForCategory(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      visa: ["labor-6", "labor-8"],
      labor: ["labor-1", "labor-2", "labor-3", "labor-4", "labor-5"],
      contract: ["civil-1", "civil-2", "civil-3"],
      business: ["corporate-1", "corporate-2", "corporate-3"],
      family: ["family-1", "family-2"],
      criminal: ["criminal-1", "criminal-2"],
      civil: ["civil-1", "civil-2"],
      ip: ["corporate-1"],
      general: ["labor-1", "civil-1", "corporate-1"],
    };
    return categoryMap[category] || categoryMap.general;
  },

  generateResponse(
    question: string,
    intent: Intent,
    laws: typeof laws,
    expertise: string,
    contextLaw?: any,
  ): string {
    // Response generation logic
    // (Keep existing mock response logic here)
    return ""; // Implement based on your needs
  },

  generateRelatedQuestions(intent: Intent, laws: typeof laws): string[] {
    const questions: string[] = [];

    if (intent.type === "NAVIGATION") {
      questions.push(`What are the requirements for ${intent.category}?`);
      questions.push(`What documents do I need for ${intent.category}?`);
    }

    if (laws.length > 0) {
      questions.push(`Tell me more about ${laws[0].title}`);
      if (laws.length > 1) {
        questions.push(`How does ${laws[0].title} relate to ${laws[1].title}?`);
      }
    }

    return questions;
  },
};
```

---

## Step 2: Update the ChatDrawer Component

**File**: `client/components/ChatDrawer.tsx`

```typescript
import { useEffect, useRef, useState } from "react";
import { X, Send, AlertCircle, Lightbulb, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiAssistantResponse, LawReference } from "@shared/api";
import type { Law } from "@shared/laws";
import { useNavigate } from "react-router-dom";
import { IntentClassifier, type Intent } from "@/server/services/intent-classifier";
import { ConfidenceScorer, type ResponseConfidence } from "@/server/services/confidence-scorer";

interface EnhancedMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  references?: LawReference[];
  intent?: Intent;
  confidence?: ResponseConfidence;
  termDefinitions?: Array<{ term: string; definition: string; arabicDefinition: string }>;
  relatedQuestions?: string[];
}

export function ChatDrawer({ isOpen, onClose, contextLaw }: ChatDrawerProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<EnhancedMessage[]>([
    {
      id: "1",
      text: getInitialMessage(),
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTermDefinitions, setShowTermDefinitions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: EnhancedMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          contextLaw,
          userExpertiseLevel: "beginner"
        }),
      });

      if (response.ok) {
        const data: AiAssistantResponse = await response.json();

        const aiMessage: EnhancedMessage = {
          id: (Date.now() + 1).toString(),
          text: data.answer,
          sender: "ai",
          timestamp: new Date(),
          references: data.references,
          intent: data.intent,
          confidence: data.confidence,
          termDefinitions: data.termDefinitions,
          relatedQuestions: data.relatedQuestions,
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gradient-to-r from-amber-50 to-amber-100">
        <div>
          <h2 className="font-semibold text-lg text-gray-900">UAE Legal Assistant</h2>
          <p className="text-xs text-gray-600 mt-1">AI-Powered Legal Guidance</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-3 rounded-lg ${
              message.sender === "user"
                ? "bg-amber-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
            }`}>
              {/* Message Text */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>

              {/* Confidence Indicator */}
              {message.confidence && message.sender === "ai" && (
                <div className="mt-2 pt-2 border-t border-gray-300 text-xs">
                  <span className="font-semibold">Confidence: </span>
                  <span className={
                    message.confidence.confidenceLevel === 'high' ? 'text-green-600' :
                    message.confidence.confidenceLevel === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }>
                    {ConfidenceScorer.getVisualIndicator(message.confidence.confidenceLevel)}
                    {ConfidenceScorer.formatScore(message.confidence.overallScore)}
                  </span>
                </div>
              )}

              {/* Law References */}
              {message.references && message.references.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                  <p className="text-xs font-semibold text-gray-700">Legal References:</p>
                  {message.references.map((ref) => (
                    <button
                      key={ref.lawId}
                      onClick={() => navigate(`/law/${ref.lawId}`)}
                      className="w-full text-left text-xs bg-white/50 hover:bg-white/80 transition-colors p-2 rounded border-l-2 border-amber-500"
                    >
                      <p className="font-semibold text-blue-600 hover:text-blue-800">{ref.title}</p>
                      <p className="text-gray-700 mt-1">{ref.legalReference}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Term Definitions */}
              {message.termDefinitions && message.termDefinitions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <button
                    onClick={() => setShowTermDefinitions(!showTermDefinitions)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" /> {message.termDefinitions.length} Term(s) Explained
                  </button>
                  {showTermDefinitions && (
                    <div className="mt-2 space-y-2">
                      {message.termDefinitions.map((term, idx) => (
                        <div key={idx} className="bg-blue-50 p-2 rounded text-xs">
                          <p className="font-semibold text-blue-900">{term.term}</p>
                          <p className="text-blue-800 mt-1">{term.definition}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Related Questions */}
              {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 space-y-1">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Related Questions:</p>
                  {message.relatedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(q)}
                      className="block text-xs text-blue-600 hover:text-blue-800 hover:underline text-left"
                    >
                      • {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Intent Type Badge */}
              {message.intent && message.sender === "ai" && (
                <div className="mt-2 text-xs">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    {message.intent.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex gap-2">
        <Input
          type="text"
          placeholder="Ask about UAE laws..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
```

---

## Step 3: Update Shared API Types

**File**: `shared/api.ts`

```typescript
import type { Intent } from "../server/services/intent-classifier";
import type { ExtractedEntities } from "../server/services/entity-extractor";
import type { ResponseConfidence } from "../server/services/confidence-scorer";

export interface AiAssistantRequest {
  question: string;
  contextLaw?: {
    id: string;
    title: string;
    content: string;
    legalReference: string;
  };
  userExpertiseLevel?: "beginner" | "intermediate" | "expert";
}

export interface LawReference {
  lawId: string;
  title: string;
  legalReference: string;
  excerpt: string;
}

export interface AiAssistantResponse {
  answer: string;
  references: LawReference[];
  intent: Intent;
  entities: ExtractedEntities;
  confidence: ResponseConfidence;
  termDefinitions: Array<{
    term: string;
    definition: string;
    arabicDefinition: string;
  }>;
  relatedQuestions?: string[];
}
```

---

## Step 4: Add New Utility Hooks

**File**: `client/hooks/use-conversation-context.ts`

```typescript
import { useState } from "react";
import type { Law } from "@shared/laws";

interface ConversationContext {
  previousQuestions: string[];
  discussedLaws: Law[];
  userExpertiseLevel: "beginner" | "intermediate" | "expert";
  preferredLanguage: string;
  clarificationsNeeded: string[];
}

export function useConversationContext(initialLaws: Law[] = []) {
  const [context, setContext] = useState<ConversationContext>({
    previousQuestions: [],
    discussedLaws: initialLaws,
    userExpertiseLevel: "beginner",
    preferredLanguage: "en",
    clarificationsNeeded: [],
  });

  const addQuestion = (question: string) => {
    setContext((prev) => ({
      ...prev,
      previousQuestions: [...prev.previousQuestions, question],
    }));
  };

  const addLaw = (law: Law) => {
    setContext((prev) => ({
      ...prev,
      discussedLaws: [
        ...prev.discussedLaws.filter((l) => l.id !== law.id),
        law,
      ],
    }));
  };

  const setExpertiseLevel = (level: "beginner" | "intermediate" | "expert") => {
    setContext((prev) => ({ ...prev, userExpertiseLevel: level }));
  };

  return { context, addQuestion, addLaw, setExpertiseLevel };
}
```

---

## Step 5: Testing the Integration

```typescript
// Test Intent Classification
import { IntentClassifier } from "@/server/services/intent-classifier";

test("classify business query", () => {
  const intent = IntentClassifier.classify("How to start a business in Dubai?");
  expect(intent.type).toBe("NAVIGATION");
  expect(intent.category).toBe("business");
  expect(intent.confidence).toBeGreaterThan(0.7);
});

// Test Entity Extraction
import { EntityExtractor } from "@/server/services/entity-extractor";

test("extract legal terms", () => {
  const entities = EntityExtractor.extract(
    "Employee entitled to 30 days leave",
  );
  expect(entities.keyTerms).toContain("leave");
  expect(entities.amounts).toBeDefined();
});

// Test Confidence Scoring
import { ConfidenceScorer } from "@/server/services/confidence-scorer";

test("score high confidence response", () => {
  const confidence = ConfidenceScorer.scoreResponse(
    "What is minimum wage?",
    [{ id: "labor-4", score: 0.95, lastUpdated: "2024-01-12" }],
    {
      hasDirectMatch: true,
      hasSemanticMatch: true,
      multipleMatches: true,
      citationsProvided: true,
      disclaimerIncluded: true,
    },
  );
  expect(confidence.confidenceLevel).toBe("high");
  expect(confidence.overallScore).toBeGreaterThan(0.8);
});

// Test Glossary
import { GlossaryService } from "@/shared/glossary";

test("get term definition", () => {
  const definition = GlossaryService.getDefinition("Gratuity");
  expect(definition).toBeDefined();
  expect(definition?.arabicTerm).toBe("تعويض نهاية الخدمة");
});
```

---

## 🚀 Next Steps

1. **Copy the code** from these implementation files
2. **Update endpoints** to use the new services
3. **Integrate UI components** with enhanced responses
4. **Test thoroughly** with various queries
5. **Deploy** and monitor

---

## ⚠️ Important Notes

- Services are modular and can be used independently
- Confidence scoring should be added to response checks
- Term definitions enrich user understanding significantly
- Related questions help users explore more
- Intent classification enables intelligent routing

---

**Ready to integrate? Start with Step 1 and work through systematically!**
