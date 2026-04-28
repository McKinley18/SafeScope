import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskService {
  suggest(category: string, description: string) {
    const descLower = description.toLowerCase();
    
    // Severity defaults
    let severity = 2; // Moderate
    if (['Machine Guarding', 'Lockout / Energy', 'Fall Protection', 'Mobile Equipment'].includes(category)) severity = 4;
    else if (['Electrical', 'Berms / Roads / Dump Points', 'Fire / Hot Work'].includes(category)) severity = 3;

    // Likelihood defaults
    let likelihood = 3; // Possible
    if (descLower.includes('missing') || descLower.includes('damaged')) likelihood = 4;
    
    // Escalation/De-escalation
    const criticalKeywords = ['fatality', 'amputation', 'fall', 'energized', 'unguarded', 'fire', 'explosion', 'rollover'];
    if (criticalKeywords.some(w => descLower.includes(w))) { severity = 5; likelihood = 4; }
    
    if (descLower.includes('minor') || descLower.includes('cosmetic')) { severity = 1; likelihood = 2; }

    const score = severity * likelihood;
    const level = score >= 20 ? 'Critical' : score >= 15 ? 'High' : score >= 8 ? 'Moderate' : 'Low';
    const priority = score >= 20 ? 'Immediate Action' : score >= 15 ? 'High Priority' : score >= 8 ? 'Correct Soon' : 'Monitor';

    return {
      severitySuggestion: ['Low', 'Moderate', 'Serious', 'High', 'Critical'][severity - 1],
      likelihoodSuggestion: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'][likelihood - 1],
      riskScore: score,
      riskLevel: level,
      priorityLabel: priority,
      riskReasoning: `Risk scored based on ${category} category and keywords.`
    };
  }
}
