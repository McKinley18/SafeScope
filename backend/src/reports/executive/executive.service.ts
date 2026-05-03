import { Injectable, NotFoundException } from "@nestjs/common";
import { generateActions } from "../../engine/action.engine";
import { calculateRisk } from "../../engine/risk.engine";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';

@Injectable()
export class ExecutiveService {
  constructor(
    @InjectRepository(Report)
    private readonly repo: Repository<Report>,
  ) {}

  async generateExecutiveSummary(reportId: string) {
  console.log("=== EXEC START ===");
    const report = await this.repo.findOne({
      where: { id: reportId },
      relations: ['attachments'],
    });

    if (!report) throw new NotFoundException('Report not found');

    const hazard = report.hazardDescription || report.title || report.narrative || "Hazard identified but not fully described";
    const severity = report.severity ?? 'unknown';

    const standardsRaw = report.likelyStandards;

const standardsList = Array.isArray(standardsRaw)
  ? standardsRaw
  : standardsRaw
    ? [standardsRaw]
    : [];

    const findings = standardsList.map((s: any, i: number) => ({
  index: i + 1,
  citation: typeof s === "string" ? s : s?.citation ?? "Not identified",
}));

    const overview = report.title
  ? "Inspection identified a " + report.title.toLowerCase().replace("detected","condition") + "."
  : "A safety condition was identified requiring attention.";

// ===== Hazard Scoring =====
const hazards = extractHazards(report);

const scoredHazards = hazards
  .map(h => ({ ...h, score: scoreHazard(h) }))
  .sort((a,b) => b.score - a.score);

const topHazard = scoredHazards.length > 0 ? scoredHazards[0] : null;

const topRisks = scoredHazards.slice(0,3).map((h,i) =>
  (i+1) + ". " + h.hazard + " — " + getRiskBand(h.score) + " (Risk Score: " + risk.riskScore + ")"
);

    

    const standardsText =
  findings.length > 0
    ? "Applicable regulatory standards include: " + findings.map(f => f.citation).join(", ") + "."
    : "No specific regulatory standard was automatically identified. A compliance review is recommended.";

    const engineOutput = generateActions(
  (report?.narrative || report?.title || "").toString()
);

    const correctiveActions = engineOutput.correctiveAction;
    const prioritizedActions = engineOutput.prioritizedActions;
    const immediateAction = engineOutput.immediateAction;

    const complianceNote =
  findings.length > 0
    ? "Potential regulatory exposure exists under applicable standards: " + findings.map(f => f.citation).join(", ") + "."
    : "No specific regulatory standard was automatically identified. A compliance review is recommended.";

    const risk = calculateRisk({
  industry: "msha",
  severity: report.severity,
  narrative: report.narrative || report.title || ""
});

const riskEvaluation = topHazard
  ? `${topHazard.hazard} presents a ${risk.riskBand.toLowerCase()}-risk condition (Risk Score: ${risk.riskScore}).`
  : report.narrative || "Risk requires further evaluation.";

    const riskPriorities = topRisks && topRisks.length > 0
      ? topRisks.join("\n")
      : "No prioritized hazards identified. Further evaluation may be required.";



return {
  reportId: report.id,
  overview,
  riskEvaluation,
  riskPriorities,
      immediateAction,
      prioritizedActions,
  standards: standardsText,
  correctiveActions,
  complianceNote,
  metadata: {
  severity,
  hasStandards: findings.length > 0,
  findingsCount: findings.length,
  riskScore: risk.riskScore,
  riskBand: risk.riskBand,
  probability: risk.probabilityScore,
  exposure: risk.exposureScore
},
  findings,
};
  } catch (err) {
  console.error("🔥 EXECUTIVE CRASH:", err);
  console.error(err?.stack);
  throw err;
}
}


const extractHazards = (report: any) => {
  const text = (report.narrative || report.title || "").toLowerCase();

  const hazards: any[] = [];

  if (text.includes("railing") || text.includes("edge")) {
    hazards.push({
      hazard: "Fall hazard from elevated surface",
      severity: "high",
    });
  }

  if (text.includes("electrical") || text.includes("wire")) {
    hazards.push({
      hazard: "Electrical hazard",
      severity: "high",
    });
  }

  return hazards;
};

const scoreHazard = (hazard: any) => {
  const map: any = { high: 5, medium: 3, low: 1 };
  return map[hazard.severity] || 1;
};

const getRiskBand = (score: number) => {
  if (score >= 7) return 'CRITICAL';
  if (score >= 5) return 'HIGH';
  if (score >= 3) return 'MODERATE';
  return 'LOW';
};

