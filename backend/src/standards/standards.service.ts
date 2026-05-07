import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StandardsService {
  private feedback: any[] = [];

  // =========================
  // 🎯 STANDARD MATCHING ENGINE (V3)
  // =========================
  matchStandards(hazard: string, type: string) {
    if (!hazard) return [];

    const h = hazard.toLowerCase();

    // =========================
    // 🔥 FALL PROTECTION (MSHA)
    // =========================
    if (h.includes('unguarded') && h.includes('edge')) {
      return [
        {
          citation: '56.11012',
          title: 'Protection for openings around travelways.',
          score: 100,
          confidence: 0.95,
          type: 'primary',
          category: 'Fall Protection',
          reasons: ['hazard_mapping'],
        },
        {
          citation: '56.15005',
          title: 'Safety belts and lines.',
          score: 80,
          confidence: 0.8,
          type: 'secondary',
          category: 'Fall Protection',
          reasons: ['hazard_mapping'],
        },
      ];
    }

    // =========================
    // 🔥 GENERAL FALL HAZARD
    // =========================
    if (h.includes('fall')) {
      return [
        {
          citation: type === 'MSHA' ? '56.15005' : '1926.501',
          title:
            type === 'MSHA'
              ? 'Safety belts and lines.'
              : 'Duty to have fall protection.',
          score: 90,
          confidence: 0.85,
          type: 'primary',
          category: 'Fall Protection',
          reasons: ['keyword_match'],
        },
      ];
    }

    // =========================
    // 🔥 ELECTRICAL
    // =========================
    if (h.includes('electrical')) {
      return [
        {
          citation: '1910.303',
          title: 'General electrical requirements.',
          score: 85,
          confidence: 0.8,
          type: 'primary',
          category: 'Electrical',
          reasons: ['keyword_match'],
        },
      ];
    }

    // =========================
    // 🔥 MOBILE EQUIPMENT
    // =========================
    if (h.includes('mobile') || h.includes('equipment')) {
      return [
        {
          citation: '56.14100',
          title: 'Safety defects; examination, correction and records.',
          score: 80,
          confidence: 0.75,
          type: 'primary',
          category: 'Mobile Equipment',
          reasons: ['keyword_match'],
        },
      ];
    }

    // =========================
    // ⚠️ NO MATCH FALLBACK
    // =========================
    return [];
  }

  // =========================
  // 🔁 FEEDBACK LOOP
  // =========================
  storeFeedback(body: any) {
    const record = {
      id: uuidv4(),
      hazard: body.hazard,
      citation: body.citation,
      action: body.action,
      replacementCitation: body.replacementCitation || null,
      createdAt: new Date(),
    };

    this.feedback.push(record);

    return record;
  }

  // =========================
  // 📊 OPTIONAL: VIEW FEEDBACK
  // =========================
  getFeedback() {
    return this.feedback;
  }
}
