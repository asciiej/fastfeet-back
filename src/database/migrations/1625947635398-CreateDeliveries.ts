import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateDeliveries1625947635398 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: "deliveries",
			columns: [
				{
					name: "id",
					type: "uuid",
					isPrimary: true,
					generationStrategy: "uuid",
					default: "uuid_generate_v4()"
				},
				{
					// Needs work
					name: "deliveryman_id",
					type: "uuid",
					
				},
				{
					name: "product",
					type: "varchar",
					isNullable: false
				},
				{
					name: "address",
					type: "varchar",
					isNullable: false
				},
				{
					name: "postal_code",
					type: "varchar",
					isNullable: false
				},
				{
					name: "neighborhood",
					type: "varchar",
					isNullable: false
				},
				{
					name: "city",
					type: "varchar",
					isNullable: false
				},
				{
					name: "state",
					type: "varchar",
					isNullable: false
				},
				{
					name: "canceled_at",
					type: "timestamp",
					isNullable: true
				},
				{
					name: "signature_id",
					type: "varchar",
					isNullable: true
				},
				{
					name: "start_date",
					type: "timestamp",
					isNullable: true
				},
				{
					name: "end_date",
					type: "timestamp",
					isNullable: true
				},
				{
					name: "created_at",
					type: "timestamp",
					default: "now()"
				},
				{
					name: "updated_at",
					type: "timestamp",
					default: "now()"
				}
			]
		}));
	};

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("deliveries");
	};
};
