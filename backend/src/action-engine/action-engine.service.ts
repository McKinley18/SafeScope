import { Injectable } from '@nestjs/common';
import { HazardFixService } from '../intelligence/hazard-fix.service';
import { FixFeedbackService } from '../intelligence/fix-feedback.service';

export interface ActionInput {
  id: string;
  category: string;
  description?: string; // Enhanced for best-match lookup
  riskScore: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | "Low" | "Moderate" | "High" | "Critical";
  confidence: number;
  patterns: { type: string, count: number }[];
  location: string;
  override: boolean;
  safeScope?: {
    classification?: string;
    riskBand?: "Low" | "Moderate" | "High" | "Critical";
    requiresShutdown?: boolean;
    imminentDanger?: boolean;
    fatalityPotential?: "low" | "medium" | "high";
    reasoning?: string[];
    standards?: { citation: string; rationale?: string }[];
  };
}

export interface GeneratedAction {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: string;
  assignedRole: string;
  source: "AI_ENGINE";
  reportId: string;
  referenceStandards?: string[];
  suggestedFixes?: string[];
  category?: string;
  originalSuggestion?: any;
}

@Injectable()
export class ActionEngineService {
  constructor(
    private readonly hazardFixService: HazardFixService,
    private readonly fixFeedbackService: FixFeedbackService,
  ) {}

  private readonly actionMap: Record<string, string> = {
    slip: "Initiate housekeeping inspection",
    ppe: "Enforce PPE compliance audit",
    electrical: "Dispatch qualified electrician immediately",
    fire: "Clear and inspect all emergency egress paths",
    machine: "Inspect machine guarding and apply lockout/tagout",
    fall: "Install fall protection or secure elevated surfaces",
    vehicle: "Restrict vehicle access and enforce traffic controls",
    "powered mobile equipment": "Establish mobile equipment traffic controls",
    housekeeping: "Restore walking-working surface conditions",
    chemical: "Verify labeling and secure hazardous materials",
    "hazard communication": "Correct chemical labeling and hazard communication controls"
  };

  async generateActionsFromReport(report: ActionInput): Promise<GeneratedAction[]> {
    const actions: GeneratedAction[] = [];

    // 1. Determine Priority
    let priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    const normalizedRiskLevel = String(report.safeScope?.riskBand || report.riskLevel || "").toUpperCase();

    if (report.override || report.safeScope?.requiresShutdown || report.safeScope?.imminentDanger) {
      priority = "CRITICAL";
    } else if (normalizedRiskLevel === "CRITICAL" || report.riskScore >= 80) {
      priority = "CRITICAL";
    } else if (normalizedRiskLevel === "HIGH" || report.riskScore >= 60) {
      priority = "HIGH";
    } else if (normalizedRiskLevel === "MODERATE" || report.riskScore >= 40) {
      priority = "MEDIUM";
    }

    // 2. Determine Due Date
    const now = new Date();
    if (priority === "CRITICAL") now.setHours(now.getHours() + 24);
    else if (priority === "HIGH") now.setDate(now.getDate() + 3);
    else if (priority === "MEDIUM") now.setDate(now.getDate() + 7);
    else now.setDate(now.getDate() + 14);

    // 3. Map Title
    const actionCategory = (report.safeScope?.classification || report.category || "unknown").toLowerCase();
    const title = this.actionMap[actionCategory] || "Perform general safety audit";

    // 🔷 4. INTELLIGENCE LOOKUP: Find Best Match for Fixes
    const reference = this.hazardFixService.findBestMatch(
      report.description || report.safeScope?.classification || report.category
    );

    // 🔷 5. FEEDBACK LOOP: Integrate Learned Fixes
    const learnedFixes = await this.fixFeedbackService.findLearnedFix(report.category);
    
    let libraryFixes = reference ? reference.fixes : [];
    let finalFixes = [...libraryFixes];

    if (learnedFixes.length > 0) {
        // Add learned fixes to the top, ensuring uniqueness
        finalFixes = [...new Set([...learnedFixes, ...libraryFixes])].slice(0, 8);
    }

    // 6. Enhance Description
    let description = "";
    if (report.patterns && report.patterns.length > 0) {
      const patternStrings = report.patterns.map(p => `${p.count} occurrences of ${p.type} hazards`);
      description = `${patternStrings.join(" and ")} detected in ${report.location}. Immediate investigation required.`;
    } else {
      description = `Observed ${report.safeScope?.classification || report.category} hazard requires corrective action based on SafeScope intelligence in ${report.location}.`;
    }

    if (report.safeScope?.requiresShutdown) {
      description += " Immediate shutdown or isolation is recommended until effective controls are verified.";
    }

    if (report.safeScope?.imminentDanger) {
      description += " Imminent-danger indicators were detected and require immediate competent-person review.";
    }

    if (report.safeScope?.reasoning?.length) {
      description += " SafeScope reasoning: " + report.safeScope.reasoning.join("; ");
    }

    if (finalFixes.length > 0) {
        description += " Recommended corrective actions: " + finalFixes.join("; ");
    }

    // 7. Role Assignment
    let assignedRole = "General Staff";
    if (priority === "CRITICAL") assignedRole = "Safety Manager";
    else if (priority === "HIGH") assignedRole = "Operations Supervisor";
    else if (priority === "MEDIUM") assignedRole = "Team Lead";

    actions.push({
      title,
      description,
      priority,
      dueDate: now.toISOString(),
      assignedRole,
      source: "AI_ENGINE",
      reportId: report.id,
      referenceStandards: report.safeScope?.standards?.length
        ? report.safeScope.standards.map((standard) => standard.citation)
        : reference ? reference.standards : [],
      suggestedFixes: finalFixes,
      category: report.category,
      originalSuggestion: reference ? { hazard: reference.hazard, fixes: reference.fixes } : null
    });

    return actions;
  }
}
