import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AddAvatarFieldToDeliveries1629119656214
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"deliveries",
			new TableColumn({
				name: "avatar",
				type: "varchar",
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("deliveries", "avatar");
	}
}
