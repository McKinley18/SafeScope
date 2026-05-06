import { MigrationInterface, QueryRunner } from "typeorm";
export declare class ExtendStandards1777896188952 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
