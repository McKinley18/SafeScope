export interface StandardInput {
  citation: string;
  title: string;
  domain?: string;
  equipmentTags?: string[];
  environmentTags?: string[];
  severityWeight?: number;
  isActive: boolean;
  summaryPlain?: string;
  recommendedActions?: string[];
}
