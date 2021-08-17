import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";

//  Usuario (Admin ou Deliveryman)

@Entity("users")
class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column()
	@Exclude()
	email: string;

	@Column()
	@Exclude()
	cpf: string;

	@Column()
	@Exclude()
	password: string;

	@Column()
	isDeliveryman: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default User;
