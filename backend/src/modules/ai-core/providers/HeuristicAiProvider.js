const BaseAiProvider = require('./BaseAiProvider');

class HeuristicAiProvider extends BaseAiProvider {
  constructor() {
    super('heuristic', 'Heuristic AI');
  }

  isConfigured() {
    return true;
  }

  async summarize(payload = {}) {
    const description = String(payload.description || '').trim();
    const title = String(payload.title || 'Opportunity').trim();
    const value = Number(payload.estimatedValue || 0);
    const relevancy = Math.max(
      35,
      Math.min(95, 45 + Math.min(description.length / 40, 25) + Math.min(value / 1_000_000, 20))
    );

    const organization = payload.organization || 'unknown issuer';
    const location = payload.location ? ` in ${payload.location}` : '';

    return {
      summary: `${title} from ${organization}${location} represents a ${value >= 5000000 ? 'high-value' : 'strategic'} pursuit with regulated laboratory delivery requirements.`,
      executiveSummary: `${organization} is seeking a qualified life sciences partner for ${title.toLowerCase()}.`,
      insights: [
        'Strong portfolio alignment with regulated laboratory and cold-chain capabilities.',
        value >= 5000000 ? 'Commercial exposure warrants executive review before proposal kickoff.' : 'Mid-market scope suitable for accelerated qualification.',
        'Extraction indicates insurance, delivery, and compliance clauses requiring legal review.'
      ],
      recommendationBullets: [
        'Advance to qualification if strategic account coverage is confirmed.',
        'Validate extracted pricing and delivery assumptions with operations.',
        'Schedule go / no-go review before bid team mobilization.'
      ],
      riskHighlights: [
        'Deadline proximity may compress proposal and validation timelines.',
        'Insurance and indemnification language may elevate delivery risk.'
      ],
      qualificationSummary: relevancy >= 70 ? 'Qualified for active pursuit.' : 'Requires additional fit validation.',
      classification: { relevancy }
    };
  }
}

module.exports = HeuristicAiProvider;
