import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1734543481453 implements MigrationInterface {
    name = 'migrations1734543481453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "firstName" character varying, "lastName" character varying, "fullName" character varying, "email" character varying NOT NULL, "phoneNumber" character varying, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "birthday" character varying, CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts"`);
    }

}
