/**
 * Entity Extraction Service
 * Identifies legal entities, terms, and references in text
 */

export interface Entity {
  text: string;
  type: 'LEGAL_TERM' | 'DOCUMENT' | 'PERSON' | 'ORGANIZATION' | 'DATE' | 'AMOUNT' | 'REFERENCE';
  startIndex: number;
  endIndex: number;
  confidence: number;
  definition?: string;
}

export interface ExtractedEntities {
  entities: Entity[];
  keyTerms: string[];
  lawReferences: string[];
  dates: string[];
  amounts: Array<{ value: string; currency: string }>;
}

const legalTermsDatabase: Record<string, { definition: string; category: string }> = {
  'gratuity': {
    definition: 'A lump-sum payment made to employees upon termination of employment',
    category: 'labor',
  },
  'visa': {
    definition: 'An official permit allowing entry and residence in a country',
    category: 'immigration',
  },
  'residency': {
    definition: 'The state of residing or being established in a place',
    category: 'immigration',
  },
  'employment': {
    definition: 'The state of having a paid job',
    category: 'labor',
  },
  'contract': {
    definition: 'A legally binding agreement between parties',
    category: 'civil',
  },
  'jurisdiction': {
    definition: 'The official power to make legal decisions and enforce the law',
    category: 'civil',
  },
  'plaintiff': {
    definition: 'A person who brings a case against another in a court of law',
    category: 'civil',
  },
  'defendant': {
    definition: 'A person accused or sued in a court of law',
    category: 'civil',
  },
  'copyright': {
    definition: 'The exclusive legal right to produce, reproduce, publish or distribute an original work',
    category: 'intellectual_property',
  },
  'trademark': {
    definition: 'A symbol, word, or phrase legally registered or established by use as representing a company or product',
    category: 'intellectual_property',
  },
  'patent': {
    definition: 'A government license conferring a right or title for a set period',
    category: 'intellectual_property',
  },
  'liability': {
    definition: 'The state of being responsible for something, especially by law',
    category: 'civil',
  },
  'negligence': {
    definition: 'Failure to take proper care in doing something',
    category: 'criminal',
  },
  'inheritance': {
    definition: 'Property, titles, debts, and obligations that pass to an heir upon death',
    category: 'family',
  },
  'custody': {
    definition: 'The protective care or guardianship of someone or something',
    category: 'family',
  },
};

// Organization patterns
const organizationPatterns = [
  /General Directorate of Residency and Foreigners Affairs/i,
  /GDRFA/i,
  /Department of Commerce and Tourism/i,
  /DCAT/i,
  /Ministry of Human Resources/i,
  /MHR/i,
  /Labour Courts/i,
  /Emirates ID/i,
];

// Law reference patterns
const lawReferencePatterns = [
  /Federal Decree\s+(?:No\.|#)?\s*\d+\s+of\s+\d+/i,
  /Cabinet Resolution\s+(?:No\.|#)?\s*\d+\s+of\s+\d+/i,
  /Article\s+\d+/i,
  /Section\s+\d+/i,
  /Law\s+No\.\s*\d+\s+of\s+\d+/i,
];

// Date patterns
const datePatterns = [
  /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, // DD/MM/YYYY
  /\b\d{4}-\d{2}-\d{2}\b/g, // YYYY-MM-DD
  /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/gi,
];

// Amount patterns (various currencies)
const amountPatterns = [
  /AED\s*[\d,]+(?:\.\d{2})?/gi, // AED
  /USD\s*\$?\s*[\d,]+(?:\.\d{2})?/gi, // USD
  /EUR\s*€?\s*[\d,]+(?:\.\d{2})?/gi, // EUR
  /[\d,]+\s*(?:AED|USD|EUR|Dirhams?|Dollars?|Euros?)/gi,
];

export class EntityExtractor {
  /**
   * Extract all entities from text
   */
  static extract(text: string): ExtractedEntities {
    const entities: Entity[] = [];
    const keyTerms: string[] = [];
    const lawReferences: string[] = [];
    const dates: string[] = [];
    const amounts: Array<{ value: string; currency: string }> = [];

    // Extract legal terms
    const termEntities = this.extractLegalTerms(text);
    entities.push(...termEntities);
    keyTerms.push(...termEntities.map(e => e.text));

    // Extract organizations
    const orgEntities = this.extractOrganizations(text);
    entities.push(...orgEntities);

    // Extract law references
    const refEntities = this.extractLawReferences(text);
    entities.push(...refEntities);
    lawReferences.push(...refEntities.map(e => e.text));

    // Extract dates
    const dateEntities = this.extractDates(text);
    entities.push(...dateEntities);
    dates.push(...dateEntities.map(e => e.text));

    // Extract amounts
    const amountEntities = this.extractAmounts(text);
    entities.push(...amountEntities);
    amounts.push(
      ...amountEntities.map(e => {
        const match = e.text.match(/([A-Z]+)/);
        return {
          value: e.text,
          currency: match ? match[1] : 'unknown',
        };
      })
    );

    return {
      entities: [...new Map(entities.map(e => [e.text, e])).values()], // Remove duplicates
      keyTerms: [...new Set(keyTerms)],
      lawReferences: [...new Set(lawReferences)],
      dates: [...new Set(dates)],
      amounts,
    };
  }

  /**
   * Extract legal terms with definitions
   */
  private static extractLegalTerms(text: string): Entity[] {
    const entities: Entity[] = [];
    const lowerText = text.toLowerCase();

    for (const [term, info] of Object.entries(legalTermsDatabase)) {
      const regex = new RegExp(`\\b${term}s?\\b`, 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'LEGAL_TERM',
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.95,
          definition: info.definition,
        });
      }
    }

    return entities;
  }

  /**
   * Extract organizations and authorities
   */
  private static extractOrganizations(text: string): Entity[] {
    const entities: Entity[] = [];

    for (const pattern of organizationPatterns) {
      const match = text.match(pattern);
      if (match) {
        entities.push({
          text: match[0],
          type: 'ORGANIZATION',
          startIndex: text.indexOf(match[0]),
          endIndex: text.indexOf(match[0]) + match[0].length,
          confidence: 0.9,
        });
      }
    }

    return entities;
  }

  /**
   * Extract law and regulation references
   */
  private static extractLawReferences(text: string): Entity[] {
    const entities: Entity[] = [];

    for (const pattern of lawReferencePatterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags + 'g');

      while ((match = regex.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'REFERENCE',
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.95,
        });
      }
    }

    return entities;
  }

  /**
   * Extract dates
   */
  private static extractDates(text: string): Entity[] {
    const entities: Entity[] = [];

    for (const pattern of datePatterns) {
      let match;

      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'DATE',
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.95,
        });
      }
    }

    return entities;
  }

  /**
   * Extract monetary amounts
   */
  private static extractAmounts(text: string): Entity[] {
    const entities: Entity[] = [];

    for (const pattern of amountPatterns) {
      let match;

      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'AMOUNT',
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.9,
        });
      }
    }

    return entities;
  }

  /**
   * Get definition for a term
   */
  static getTermDefinition(term: string): { definition: string; category: string } | null {
    const lowerTerm = term.toLowerCase();
    return legalTermsDatabase[lowerTerm] || null;
  }

  /**
   * Is this term a legal term?
   */
  static isLegalTerm(term: string): boolean {
    return term.toLowerCase() in legalTermsDatabase;
  }

  /**
   * Add a custom legal term
   */
  static addCustomTerm(term: string, definition: string, category: string): void {
    legalTermsDatabase[term.toLowerCase()] = { definition, category };
  }
}
