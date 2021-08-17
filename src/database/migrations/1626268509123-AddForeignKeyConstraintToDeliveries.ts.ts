import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export default class addForeignKeyConstraintToDeliveries1626122860201
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createForeignKey(
			"deliveries",
			new TableForeignKey({
				name: "UserDeliveryFK",
				columnNames: ["deliveryman_id"],
				referencedColumnNames: ["id"],
				referencedTableName: "users",
				onDelete: "SET NULL",
				onUpdate: "CASCADE",
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey("deliveries", "UserDeliveryFK");
	}
}
