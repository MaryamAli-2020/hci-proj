/**
 * Intent Classification Service
 * Classifies user queries into specific intents to provide better responses
 */

export interface Intent {
  type: 'QUERY' | 'CLARIFICATION' | 'NAVIGATION' | 'FEEDBACK' | 'DEFINITION';
  confidence: number;
  category: string; // 'visa', 'labor', 'contract', 'business', 'family', 'criminal', 'civil', 'ip'
  subcategory?: string;
  entities: string[];
  suggestedAction: string;
}

// Patterns for different intent types
const intentPatterns = {
  QUERY: [
    /what\s+(is|are|does)?/i,
    /tell\s+me\s+about/i,
    /explain/i,
    /information\s+about/i,
    /details\s+about/i,
  ],
  CLARIFICATION: [
    /why/i,
    /how\s+does/i,
    /clarify/i,
    /what\s+does.*mean/i,
    /confused/i,
  ],
  NAVIGATION: [
    /how\s+to/i,
    /steps\s+(to|for)/i,
    /process\s+(to|for)/i,
    /procedure/i,
    /requirements/i,
  ],
  DEFINITION: [
    /define/i,
    /what\s+is\s+a/i,
    /meaning\s+of/i,
    /term/i,
    /glossary/i,
  ],
  FEEDBACK: [
    /thank/i,
    /good|great|excellent/i,
    /wrong|incorrect|inaccurate/i,
    /report/i,
    /issue|bug/i,
  ],
};

// Category patterns
const categoryPatterns: Record<string, RegExp[]> = {
  visa: [/visa/i, /residency/i, /residence\s+permit/i, /entry\s+permit/i],
  labor: [/labor/i, /employment/i, /employee/i, /work/i, /wage/i, /salary/i, /leave/i, /overtime/i],
  contract: [/contract/i, /agreement/i, /terms/i, /conditions/i],
  business: [/business/i, /company/i, /corporate/i, /trade\s+license/i, /free\s+zone/i],
  family: [/marriage/i, /divorce/i, /custody/i, /inheritance/i, /family/i],
  criminal: [/crime/i, /criminal/i, /offense/i, /penalty/i, /punishment/i],
  civil: [/civil/i, /dispute/i, /tort/i, /property/i],
  ip: [/patent/i, /trademark/i, /copyright/i, /intellectual\s+property/i],
};

export class IntentClassifier {
  /**
   * Classify a user query
   */
  static classify(query: string, previousContext?: string[]): Intent {
    if (!query || query.trim().length === 0) {
      return {
        type: 'QUERY',
        confidence: 0.3,
        category: 'general',
        entities: [],
        suggestedAction: 'request_clarification',
      };
    }

    const lowerQuery = query.toLowerCase();
    const intents = this.detectIntents(lowerQuery);
    const primaryIntent = intents[0] || 'QUERY';

    const category = this.detectCategory(lowerQuery);
    const entities = this.extractEntities(lowerQuery);
    const confidence = this.calculateConfidence(lowerQuery, primaryIntent, category);

    return {
      type: primaryIntent as any,
      confidence,
      category,
      entities,
      suggestedAction: this.suggestAction(primaryIntent, category),
    };
  }

  /**
   * Detect intent types from query
   */
  private static detectIntents(query: string): string[] {
    const detectedIntents: Array<{ type: string; score: number }> = [];

    for (const [intentType, patterns] of Object.entries(intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(query)) {
          const existing = detectedIntents.find(i => i.type === intentType);
          if (existing) {
            existing.score += 0.1;
          } else {
            detectedIntents.push({ type: intentType, score: 0.5 });
          }
        }
      }
    }

    // Sort by score descending
    detectedIntents.sort((a, b) => b.score - a.score);
    return detectedIntents.map(i => i.type);
  }

  /**
   * Detect legal category from query
   */
  private static detectCategory(query: string): string {
    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(query)) {
          return category;
        }
      }
    }
    return 'general';
  }

  /**
   * Extract entities (legal terms, names, etc.)
   */
  private static extractEntities(query: string): string[] {
    const entities: string[] = [];

    // Extract common legal terms
    const legalTerms = [
      'visa',
      'residency',
      'employment',
      'contract',
      'business',
      'marriage',
      'divorce',
      'custody',
      'crime',
      'patent',
      'trademark',
      'copyright',
    ];

    for (const term of legalTerms) {
      if (query.includes(term)) {
        entities.push(term);
      }
    }

    // Extract numbers (dates, amounts, percentages)
    const numberMatches = query.match(/\d+/g);
    if (numberMatches) {
      entities.push(...numberMatches);
    }

    // Extract quoted phrases
    const quotedMatches = query.match(/"([^"]*)"/g);
    if (quotedMatches) {
      entities.push(...quotedMatches.map(q => q.slice(1, -1)));
    }

    return [...new Set(entities)]; // Remove duplicates
  }

  /**
   * Calculate confidence score
   */
  private static calculateConfidence(
    query: string,
    intentType: string,
    category: string
  ): number {
    let confidence = 0.5; // Base confidence

    // Increase for specific intent patterns
    if (query.split(' ').length > 3) confidence += 0.1; // Longer queries are clearer
    if (category !== 'general') confidence += 0.15; // Specific category found
    if (query.includes('?')) confidence += 0.1; // Question mark indicates clarity
    if (intentType !== 'QUERY') confidence += 0.05; // Specific intent type

    return Math.min(1, confidence); // Cap at 1.0
  }

  /**
   * Suggest appropriate action based on intent and category
   */
  private static suggestAction(intentType: string, category: string): string {
    switch (intentType) {
      case 'QUERY':
        return 'provide_answer_with_references';
      case 'CLARIFICATION':
        return 'clarify_with_examples';
      case 'NAVIGATION':
        return 'provide_step_by_step_guide';
      case 'DEFINITION':
        return 'provide_definition_with_context';
      case 'FEEDBACK':
        return 'acknowledge_and_record';
      default:
        return 'provide_answer_with_references';
    }
  }

  /**
   * Is this a high-confidence query?
   */
  static isHighConfidence(intent: Intent): boolean {
    return intent.confidence > 0.7;
  }

  /**
   * Is this a complex legal query?
   */
  static isComplexQuery(query: string): boolean {
    const complexIndicators = [
      /multiple/i,
      /scenario/i,
      /situation/i,
      /both/i,
      /and/i,
      /or/i,
      /condition/i,
      /if/i,
    ];

    return complexIndicators.some(pattern => pattern.test(query));
  }
}
