"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
const rule_entity_1 = require("../taxonomy/entities/rule.entity");
const standard_entity_1 = require("../standards/entities/standard.entity");
const corrective_action_template_entity_1 = require("../standards/entities/corrective-action-template.entity");
const standards_seed_1 = require("../standards/seeds/standards.seed");
async function seed() {
    const ds = await data_source_1.dataSource.initialize();
    try {
        const ruleRepo = ds.getRepository(rule_entity_1.ClassificationRule);
        const existing = await ruleRepo.findOne({
            where: { code: 'fall_protection_missing' },
        });
        if (!existing) {
            await ruleRepo.save(ruleRepo.create({
                code: 'fall_protection_missing',
                severity: 5,
                keywords: ['fall protection', 'unguarded edge', 'open edge', 'no harness'],
                isActive: true,
            }));
            console.log('Seeded classification rule: fall_protection_missing');
        }
        else {
            console.log('Classification rule already exists: fall_protection_missing');
        }
        const standardRepo = ds.getRepository(standard_entity_1.Standard);
        const templateRepo = ds.getRepository(corrective_action_template_entity_1.CorrectiveActionTemplate);
        for (const item of standards_seed_1.standardSeeds.filter(Boolean)) {
            const existingStandard = await standardRepo.findOne({
                where: { citation: item.citation },
            });
            let savedStandard;
            if (existingStandard) {
                Object.assign(existingStandard, item, { lastSyncedAt: new Date() });
                savedStandard = await standardRepo.save(existingStandard);
            }
            else {
                savedStandard = await standardRepo.save({
                    ...item,
                    lastSyncedAt: new Date(),
                });
            }
            const existingTemplate = await templateRepo.findOne({
                where: { standardId: savedStandard.id },
            });
            if (!existingTemplate) {
                await templateRepo.save(templateRepo.create({
                    hazardCategoryCode: savedStandard.keywords?.[0] || 'general',
                    standardId: savedStandard.id,
                    title: `Corrective action for ${savedStandard.citation}`,
                    recommendedAction: `Correct the condition related to ${savedStandard.title} and document verification.`,
                    lowCostOption: 'Remove exposure, barricade the area if needed, and complete a documented field correction.',
                    bestPracticeOption: 'Create a permanent engineered or administrative control, assign ownership, and verify completion.',
                    verificationSteps: 'Verify the hazard was corrected, photograph the corrected condition, and document the responsible person/date.',
                    estimatedRiskReduction: 70,
                }));
            }
        }
        console.log(`Seeded/updated standards: ${standards_seed_1.standardSeeds.filter(Boolean).length}`);
        console.log('Seed completed successfully.');
    }
    catch (error) {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    }
    finally {
        await ds.destroy();
    }
}
seed();
//# sourceMappingURL=seed.js.map