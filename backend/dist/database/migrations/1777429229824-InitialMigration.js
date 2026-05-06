"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1777429229824 = void 0;
class InitialMigration1777429229824 {
    constructor() {
        this.name = 'InitialMigration1777429229824';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "standards_master" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "agency_code" character varying NOT NULL, "citation" character varying NOT NULL, "part_number" character varying, "subpart" character varying, "title" character varying NOT NULL, "standard_text" text NOT NULL, "plain_language_summary" text, "scope_code" character varying NOT NULL, "hazard_codes" text, "keywords" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cf656a8e6fe9f03442687fcabfb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c27d52393c2c29e8c67eb4192e" ON "standards_master" ("agency_code", "citation") `);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "regulatoryCrosswalk"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "conditionId"`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" DROP COLUMN "synonyms"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "synonyms" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "conditionId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hazard_taxonomy" ADD "regulatoryCrosswalk" jsonb`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c27d52393c2c29e8c67eb4192e"`);
        await queryRunner.query(`DROP TABLE "standards_master"`);
    }
}
exports.InitialMigration1777429229824 = InitialMigration1777429229824;
//# sourceMappingURL=1777429229824-InitialMigration.js.map