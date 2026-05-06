"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutiveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("../entities/report.entity");
const control_verifications_service_1 = require("../../control-verifications/control-verifications.service");
const standards_service_1 = require("../../standards/standards.service");
const hazard_classifier_1 = require("../../engine/hazard.classifier");
const required_controls_1 = require("../../engine/controls/required.controls");
const control_expansion_1 = require("../../engine/controls/control.expansion");
const control_state_1 = require("../../engine/controls/control.state");
const risk_engine_1 = require("../../engine/risk.engine");
const action_engine_1 = require("../../engine/action.engine");
let ExecutiveService = class ExecutiveService {
    constructor(repo, controlVerificationSvc, standardsService) {
        this.repo = repo;
        this.controlVerificationSvc = controlVerificationSvc;
        this.standardsService = standardsService;
    }
    async generateExecutiveSummary(reportId) {
        const report = await this.repo.findOne({
            where: { id: reportId },
            relations: ["attachments"],
        });
        if (!report)
            throw new common_1.NotFoundException("Report not found");
        const text = report.narrative || report.title || "";
        const classification = (0, hazard_classifier_1.classifyHazard)(text);
        const hazardTypes = classification?.hazardTypes || [];
        const ranked = (0, hazard_classifier_1.rankHazards)(hazardTypes);
        const primaryHazard = ranked.length ? ranked[0].type : null;
        const controlFindings = (0, required_controls_1.evaluateRequiredControls)(text) || [];
        const normalize = (v) => String(v || "").toLowerCase().trim().replace(/\s+/g, "_");
        const requiredControls = Array.from(new Set([
            ...(0, control_expansion_1.expandControlsFromHazards)(hazardTypes).map(normalize),
            ...(hazardTypes.includes("fall_hazard_from_lift")
                ? ["fall_protection", "harness", "tie_off", "anchor_point"]
                : []),
        ]));
        const controlStates = (0, control_state_1.buildControlStates)(hazardTypes, controlFindings, requiredControls);
        const savedVerifications = await this.controlVerificationSvc.getForReport(reportId);
        const overrideMap = new Map((savedVerifications || []).map(v => [
            normalize(v.control),
            v.status,
        ]));
        const finalStates = controlStates.map(c => ({
            ...c,
            state: overrideMap.get(normalize(c.control)) || c.state,
        }));
        const presentControls = finalStates.filter(c => c.state === "present");
        const missingControls = finalStates.filter(c => c.state === "missing");
        const presentCount = presentControls.length;
        const requiredCount = requiredControls.length;
        const complianceScore = requiredCount > 0 ? Math.round((presentCount / requiredCount) * 100) : 0;
        const risk = (0, risk_engine_1.calculateRisk)({
            severity: report.severity,
            controls: controlFindings,
        });
        const engineOutput = (0, action_engine_1.generateActions)(text, risk.riskBand);
        const matchedStandards = await this.standardsService.findByControls(requiredControls);
        const standardsText = matchedStandards.length
            ? matchedStandards
                .map(s => `${s.citation} — ${s.title}`)
                .join("\n")
            : "";
        const riskPriorities = [
            ...ranked.map((h, i) => {
                const hazardRisk = (0, risk_engine_1.calculateHazardRisk)({ severity: report.severity, probability: 3, exposure: 3 }, h.type);
                return `${i + 1}. ${h.type.replace(/_/g, " ")} — ${hazardRisk.riskBand} (Score: ${hazardRisk.riskScore})`;
            }),
            ...missingControls.map((c, i) => `${i + ranked.length + 1}. Missing ${c.control.replace(/_/g, " ")} — REQUIRED`),
        ].join("\n");
        return {
            reportId: report.id,
            overview: primaryHazard
                ? `Inspection identified: ${primaryHazard.replace(/_/g, " ")}.`
                : "A safety condition was identified requiring attention.",
            riskEvaluation: `${primaryHazard?.replace(/_/g, " ") || "Hazard"} presents a ${risk.riskBand.toLowerCase()}-risk condition (Score: ${risk.riskScore}).`,
            riskPriorities,
            immediateAction: engineOutput.immediateAction,
            prioritizedActions: engineOutput.prioritizedActions,
            standards: standardsText,
            correctiveActions: engineOutput.correctiveAction,
            complianceNote: "",
            metadata: {
                complianceScore,
                controlsRequired: requiredControls.length,
                controlsMissing: missingControls.length,
                severity: report.severity ?? "unknown",
                hasStandards: matchedStandards.length > 0,
                findingsCount: 0,
                riskScore: risk.riskScore,
                riskBand: risk.riskBand,
            },
            findings: [],
        };
    }
};
exports.ExecutiveService = ExecutiveService;
exports.ExecutiveService = ExecutiveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        control_verifications_service_1.ControlVerificationsService,
        standards_service_1.StandardsService])
], ExecutiveService);
//# sourceMappingURL=executive.service.js.map