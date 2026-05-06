"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const report_entity_1 = require("../reports/entities/report.entity");
const attachment_entity_1 = require("../reports/entities/attachment.entity");
const classification_entity_1 = require("../classifications/entities/classification.entity");
const rule_entity_1 = require("../taxonomy/entities/rule.entity");
const audit_log_entity_1 = require("../audit/entities/audit-log.entity");
const review_entity_1 = require("../reviews/entities/review.entity");
const risk_score_entity_1 = require("../risk/entities/risk-score.entity");
const corrective_action_entity_1 = require("../corrective-actions/entities/corrective-action.entity");
const standard_entity_1 = require("../standards/entities/standard.entity");
const hazard_category_entity_1 = require("../standards/entities/hazard-category.entity");
const hazard_standard_mapping_entity_1 = require("../standards/entities/hazard-standard-mapping.entity");
const corrective_action_template_entity_1 = require("../standards/entities/corrective-action-template.entity");
const report_language_template_entity_1 = require("../standards/entities/report-language-template.entity");
const classification_feedback_entity_1 = require("../standards/entities/classification-feedback.entity");
const regulatory_agency_entity_1 = require("../regulatory/entities/regulatory-agency.entity");
const regulatory_part_entity_1 = require("../regulatory/entities/regulatory-part.entity");
const regulatory_subpart_entity_1 = require("../regulatory/entities/regulatory-subpart.entity");
const regulatory_section_entity_1 = require("../regulatory/entities/regulatory-section.entity");
const regulatory_paragraph_entity_1 = require("../regulatory/entities/regulatory-paragraph.entity");
const hazard_taxonomy_entity_1 = require("../intelligence-framework/entities/hazard-taxonomy.entity");
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "mckinley",
    password: "",
    database: "sentinel_safety",
    entities: [
        report_entity_1.Report,
        attachment_entity_1.ReportAttachment,
        classification_entity_1.Classification,
        rule_entity_1.ClassificationRule,
        audit_log_entity_1.AuditLog,
        review_entity_1.Review,
        risk_score_entity_1.RiskScore,
        corrective_action_entity_1.CorrectiveAction,
        standard_entity_1.Standard,
        hazard_category_entity_1.HazardCategoryEntity,
        hazard_standard_mapping_entity_1.HazardStandardMapping,
        corrective_action_template_entity_1.CorrectiveActionTemplate,
        report_language_template_entity_1.ReportLanguageTemplate,
        classification_feedback_entity_1.ClassificationFeedback,
        regulatory_agency_entity_1.RegulatoryAgency,
        regulatory_part_entity_1.RegulatoryPart,
        regulatory_subpart_entity_1.RegulatorySubpart,
        regulatory_section_entity_1.RegulatorySection,
        regulatory_paragraph_entity_1.RegulatoryParagraph,
        hazard_taxonomy_entity_1.HazardTaxonomy,
    ],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map