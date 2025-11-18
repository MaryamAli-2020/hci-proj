/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * AI Legal Assistant types
 */
export interface AiAssistantRequest {
  question: string;
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
}
