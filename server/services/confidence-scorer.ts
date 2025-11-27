/**
 * Confidence Scoring Service
 * Evaluates the confidence level of AI responses
 */

export interface ResponseConfidence {
  overallScore: number; // 0 to 1
  sourceAccuracy: number;
  relevanceScore: number;
  dataFreshness: number;
  factors: {
    lawFound: boolean;
    directMatch: boolean;
    semanticMatch: boolean;
    multipleSourcesAgree: boolean;
    recentlyUpdated: boolean;
    uniqueMatch: boolean;
  };
  disclaimers: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
  recommendedActions: string[];
}

export class ConfidenceScorer {
  /**
   * Calculate confidence score for an AI response
   */
  static scoreResponse(
    query: string,
    foundLaws: Array<{ id: string; score: number; lastUpdated?: string }>,
    responseQuality: {
      hasDirectMatch: boolean;
      hasSemanticMatch: boolean;
      multipleMatches: boolean;
      citationsProvided: boolean;
      disclaimerIncluded: boolean;
    }
  ): ResponseConfidence {
    const factors = {
      lawFound: foundLaws.length > 0,
      directMatch: responseQuality.hasDirectMatch,
      semanticMatch: responseQuality.hasSemanticMatch,
      multipleSourcesAgree: foundLaws.length >= 2,
      recentlyUpdated: this.isRecentlyUpdated(foundLaws),
      uniqueMatch: foundLaws.length === 1,
    };

    // Calculate individual scores
    const sourceAccuracy = this.calculateSourceAccuracy(factors, foundLaws);
    const relevanceScore = this.calculateRelevanceScore(query, foundLaws);
    const dataFreshness = this.calculateDataFreshness(foundLaws);

    // Overall score (weighted average)
    const overallScore =
      sourceAccuracy * 0.4 + relevanceScore * 0.35 + dataFreshness * 0.25;

    // Determine confidence level
    const confidenceLevel = this.getConfidenceLevel(overallScore);

    // Generate disclaimers
    const disclaimers = this.generateDisclaimers(factors, confidenceLevel);

    // Recommended actions
    const recommendedActions = this.getRecommendedActions(
      confidenceLevel,
      factors,
      query
    );

    return {
      overallScore: Math.min(1, Math.max(0, overallScore)),
      sourceAccuracy,
      relevanceScore,
      dataFreshness,
      factors,
      disclaimers,
      confidenceLevel,
      recommendedActions,
    };
  }

  /**
   * Calculate source accuracy score
   */
  private static calculateSourceAccuracy(
    factors: any,
    foundLaws: Array<{ id: string; score: number }>
  ): number {
    let score = 0.3; // Base score

    // Increase for positive factors
    if (factors.lawFound) score += 0.25;
    if (factors.directMatch) score += 0.2;
    if (factors.multipleSourcesAgree) score += 0.15;
    if (factors.recentlyUpdated) score += 0.1;

    // Decrease for missing factors
    if (!factors.lawFound) score -= 0.3;
    if (factors.uniqueMatch) score -= 0.05; // Single source is less reliable

    // Adjust based on number of laws
    const avgLawScore = foundLaws.length > 0 
      ? foundLaws.reduce((sum, l) => sum + l.score, 0) / foundLaws.length 
      : 0;
    
    score += avgLawScore * 0.15;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate relevance score
   */
  private static calculateRelevanceScore(
    query: string,
    foundLaws: Array<{ id: string; score: number }>
  ): number {
    if (foundLaws.length === 0) return 0.2; // Low relevance if no laws found

    const avgScore = foundLaws.reduce((sum, l) => sum + l.score, 0) / foundLaws.length;
    const bonusForMultiple = foundLaws.length >= 2 ? 0.1 : 0;
    const bonusForTopScore = foundLaws[0].score > 0.8 ? 0.05 : 0;

    return Math.min(1, avgScore + bonusForMultiple + bonusForTopScore);
  }

  /**
   * Calculate data freshness score
   */
  private static calculateDataFreshness(
    foundLaws: Array<{ id: string; score: number; lastUpdated?: string }>
  ): number {
    if (foundLaws.length === 0) return 0;

    let freshnessScores = foundLaws.map(law => {
      if (!law.lastUpdated) return 0.5; // Neutral if no date

      const lastUpdated = new Date(law.lastUpdated);
      const now = new Date();
      const daysSinceUpdate = Math.floor(
        (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceUpdate < 30) return 1.0; // Very fresh
      if (daysSinceUpdate < 90) return 0.9;
      if (daysSinceUpdate < 180) return 0.8;
      if (daysSinceUpdate < 365) return 0.7;
      if (daysSinceUpdate < 730) return 0.6;
      return 0.4; // Old data
    });

    return freshnessScores.reduce((a, b) => a + b, 0) / freshnessScores.length;
  }

  /**
   * Determine confidence level based on score
   */
  private static getConfidenceLevel(
    score: number
  ): 'high' | 'medium' | 'low' {
    if (score >= 0.8) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * Check if laws were recently updated
   */
  private static isRecentlyUpdated(
    foundLaws: Array<{ id: string; score: number; lastUpdated?: string }>
  ): boolean {
    return foundLaws.some(law => {
      if (!law.lastUpdated) return false;
      const lastUpdated = new Date(law.lastUpdated);
      const now = new Date();
      const daysSinceUpdate = Math.floor(
        (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceUpdate < 90;
    });
  }

  /**
   * Generate appropriate disclaimers
   */
  private static generateDisclaimers(factors: any, level: string): string[] {
    const disclaimers: string[] = [];

    // Always include main disclaimer
    disclaimers.push(
      'This is AI-generated information and not professional legal advice.'
    );

    if (!factors.lawFound) {
      disclaimers.push(
        'No direct legal sources found. Information is based on general knowledge.'
      );
    }

    if (!factors.directMatch && factors.semanticMatch) {
      disclaimers.push(
        'Response based on semantic analysis. Verify with official legal texts.'
      );
    }

    if (level === 'low') {
      disclaimers.push(
        'Low confidence response. Please consult with a qualified legal professional.'
      );
    }

    if (level === 'medium') {
      disclaimers.push(
        'Medium confidence. Information should be verified with official sources or legal counsel.'
      );
    }

    if (!factors.recentlyUpdated) {
      disclaimers.push('Some referenced laws may have been updated. Verify current status.');
    }

    if (factors.uniqueMatch) {
      disclaimers.push('Single legal source found. Multiple sources recommended for verification.');
    }

    disclaimers.push('For specific legal situations, consult with a qualified UAE legal professional.');

    return disclaimers;
  }

  /**
   * Get recommended actions based on confidence
   */
  private static getRecommendedActions(
    level: string,
    factors: any,
    query: string
  ): string[] {
    const actions: string[] = [];

    if (level === 'high') {
      actions.push('Display response with confidence indicator');
      actions.push('Highlight source laws with citations');
    }

    if (level === 'medium') {
      actions.push('Display response with caution indicator');
      actions.push('Suggest consulting professional');
      actions.push('Offer to escalate to human review');
    }

    if (level === 'low') {
      actions.push('Flag for human review');
      actions.push('Display prominent disclaimer');
      actions.push('Suggest contacting legal professional');
      actions.push('Offer alternative search or rephrasing');
    }

    if (!factors.lawFound) {
      actions.push('Suggest browsing related categories');
      actions.push('Offer to rephrase query');
    }

    if (!factors.multipleSourcesAgree) {
      actions.push('Search for related laws');
      actions.push('Suggest legal professional consultation');
    }

    return actions;
  }

  /**
   * Get visual indicator for confidence level
   */
  static getVisualIndicator(level: string): string {
    switch (level) {
      case 'high':
        return '🟢'; // Green
      case 'medium':
        return '🟡'; // Yellow
      case 'low':
        return '🔴'; // Red
      default:
        return '⚪'; // Gray
    }
  }

  /**
   * Format confidence score as percentage
   */
  static formatScore(score: number): string {
    return `${Math.round(score * 100)}%`;
  }

  /**
   * Is response suitable for high-stakes decisions?
   */
  static isSuitableForHighStakes(confidence: ResponseConfidence): boolean {
    return (
      confidence.overallScore >= 0.85 &&
      confidence.factors.lawFound &&
      confidence.factors.multipleSourcesAgree &&
      confidence.factors.recentlyUpdated
    );
  }

  /**
   * Should human review this response?
   */
  static requiresHumanReview(confidence: ResponseConfidence): boolean {
    return (
      confidence.overallScore < 0.6 ||
      !confidence.factors.lawFound ||
      confidence.factors.uniqueMatch
    );
  }
}
