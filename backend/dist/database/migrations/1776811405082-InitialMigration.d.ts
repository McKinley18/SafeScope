import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitialMigration1776811405082 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
