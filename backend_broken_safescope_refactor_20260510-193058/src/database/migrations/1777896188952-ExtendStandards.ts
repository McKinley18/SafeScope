import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendStandards1777896188952 implements MigrationInterface {
    name = 'ExtendStandards1777896188952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "regulatoryCrosswalk"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "conditionId"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "synonyms"`);
        await queryRunner.query(`ALTER TABLE "standards_master" ADD "required_controls" text`);
        await queryRunner.query(`ALTER TABLE "standards_master" ADD "severity_weight" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "standards_master" DROP COLUMN "severity_weight"`);
        await queryRunner.query(`ALTER TABLE "standards_master" DROP COLUMN "required_controls"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "synonyms" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "conditionId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "regulatoryCrosswalk" jsonb`);
    }

}
