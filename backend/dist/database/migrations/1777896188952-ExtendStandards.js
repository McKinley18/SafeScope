"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendStandards1777896188952 = void 0;
class ExtendStandards1777896188952 {
    constructor() {
        this.name = 'ExtendStandards1777896188952';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "regulatoryCrosswalk"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "conditionId"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "synonyms"`);
        await queryRunner.query(`ALTER TABLE "standards_master" ADD "required_controls" text`);
        await queryRunner.query(`ALTER TABLE "standards_master" ADD "severity_weight" integer NOT NULL DEFAULT '1'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "standards_master" DROP COLUMN "severity_weight"`);
        await queryRunner.query(`ALTER TABLE "standards_master" DROP COLUMN "required_controls"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "synonyms" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "conditionId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "regulatoryCrosswalk" jsonb`);
    }
}
exports.ExtendStandards1777896188952 = ExtendStandards1777896188952;
//# sourceMappingURL=1777896188952-ExtendStandards.js.map