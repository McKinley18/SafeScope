import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSource } from './data-source';
import { ClassificationRule } from '../taxonomy/entities/rule.entity';
import { Standard } from '../standards/entities/standard.entity';
import { CorrectiveActionTemplate } from '../standards/entities/corrective-action-template.entity';
import { standardSeeds } from '../standards/seeds/standards.seed';

async function seed() {
  const ds: DataSource = await dataSource.initialize();

  try {
    const ruleRepo = ds.getRepository(ClassificationRule);

    const existing = await ruleRepo.findOne({
      where: { code: 'fall_protection_missing' },
    });

    if (!existing) {
      await ruleRepo.save(
        ruleRepo.create({
          code: 'fall_protection_missing',
          severity: 5,
          keywords: ['fall protection', 'unguarded edge', 'open edge', 'no harness'],
          isActive: true,
        }),
      );
      console.log('Seeded classification rule: fall_protection_missing');
    } else {
      console.log('Classification rule already exists: fall_protection_missing');
    }

    const standardRepo = ds.getRepository(Standard);
    const templateRepo = ds.getRepository(CorrectiveActionTemplate);

    for (const item of standardSeeds) {
      const existingStandard = await standardRepo.findOne({
        where: { citation: item.citation },
      });

      const savedStandard = existingStandard
        ? await standardRepo.save(
            standardRepo.create({
              ...existingStandard,
              ...item,
              lastSyncedAt: new Date(),
            }),
          )
        : await standardRepo.save(
            standardRepo.create({
              ...item,
              lastSyncedAt: new Date(),
            } as any),
          );

      const existingTemplate = await templateRepo.findOne({
        where: { standardId: savedStandard.id },
      });

      if (!existingTemplate) {
        await templateRepo.save(
          templateRepo.create({
            hazardCategoryCode: savedStandard.keywords?.[0] || 'general',
            standardId: savedStandard.id,
            title: `Corrective action for ${savedStandard.citation}`,
            recommendedAction: `Correct the condition related to ${savedStandard.heading} and document verification.`,
            lowCostOption: 'Remove exposure, barricade the area if needed, and complete a documented field correction.',
            bestPracticeOption: 'Create a permanent engineered or administrative control, assign ownership, and verify completion.',
            verificationSteps: 'Verify the hazard was corrected, photograph the corrected condition, and document the responsible person/date.',
            estimatedRiskReduction: 70,
          }),
        );
      }
    }

    console.log(`Seeded/updated standards: ${standardSeeds.length}`);
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await ds.destroy();
  }
}

seed();
