import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDistrictAndProvinceAndWWardAndUserAddress1775791933106 implements MigrationInterface {
  name = 'CreateDistrictAndProvinceAndWWardAndUserAddress1775791933106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`provinces\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`districts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`name\` varchar(255) NOT NULL, \`province_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`wards\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`name\` varchar(255) NOT NULL, \`province_id\` int NOT NULL, \`district_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users-address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdBy\` int NULL, \`updatedBy\` int NULL, \`name\` varchar(255) NOT NULL, \`phone\` varchar(10) NOT NULL, \`user_id\` int NOT NULL, \`province_id\` int NOT NULL, \`district_id\` int NOT NULL, \`ward_id\` int NOT NULL, \`type\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`districts\` ADD CONSTRAINT \`FK_9d451638507b11822dc411a2dfe\` FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wards\` ADD CONSTRAINT \`FK_d5d88a978693bfe04cc6d55871d\` FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wards\` ADD CONSTRAINT \`FK_3d1ef92876a28d10ac2d3fe766b\` FOREIGN KEY (\`district_id\`) REFERENCES \`districts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users-address\` ADD CONSTRAINT \`FK_9e36c596005db97b968eb028db9\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users-address\` ADD CONSTRAINT \`FK_6ee2d587540aa271c3feb49013a\` FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users-address\` ADD CONSTRAINT \`FK_75d4ffc1fc3388fc4f3e2fa5250\` FOREIGN KEY (\`district_id\`) REFERENCES \`districts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users-address\` ADD CONSTRAINT \`FK_d065763cf5953781078c8663807\` FOREIGN KEY (\`ward_id\`) REFERENCES \`wards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users-address\` DROP FOREIGN KEY \`FK_d065763cf5953781078c8663807\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users-address\` DROP FOREIGN KEY \`FK_75d4ffc1fc3388fc4f3e2fa5250\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users-address\` DROP FOREIGN KEY \`FK_6ee2d587540aa271c3feb49013a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users-address\` DROP FOREIGN KEY \`FK_9e36c596005db97b968eb028db9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`wards\` DROP FOREIGN KEY \`FK_3d1ef92876a28d10ac2d3fe766b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`wards\` DROP FOREIGN KEY \`FK_d5d88a978693bfe04cc6d55871d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_9d451638507b11822dc411a2dfe\``,
    );
    await queryRunner.query(`DROP TABLE \`users-address\``);
    await queryRunner.query(`DROP TABLE \`wards\``);
    await queryRunner.query(`DROP TABLE \`districts\``);
    await queryRunner.query(`DROP TABLE \`provinces\``);
  }
}
