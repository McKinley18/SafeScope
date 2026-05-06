export type IndustryMode = 'MSHA' | 'OSHA_GENERAL_INDUSTRY' | 'OSHA_CONSTRUCTION';
export type StandardIntelligenceProfile = {
    citation: string;
    agency: 'MSHA' | 'OSHA';
    industryModes: IndustryMode[];
    hazardFamilies: string[];
    equipment: string[];
    components: string[];
    conditions: string[];
    exposureTriggers: string[];
    fieldPhrases: string[];
    exclusions: string[];
    severityHint: 'low' | 'moderate' | 'high' | 'critical';
    correctiveThemes: string[];
};
export declare const STANDARD_INTELLIGENCE_PROFILES: StandardIntelligenceProfile[];
