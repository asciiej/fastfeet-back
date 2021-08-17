import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import User from "./User";

@Entity("deliveries")
class Deliveries {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	deliveryman_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: "deliveryman_id" })
	deliveryman: User;

	@Column()
	product: string;

	@Column()
	@Exclude()
	address: string;

	@Column()
	@Exclude()
	postal_code: string;

	@Column()
	@Exclude()
	neighborhood: string;

	@Column()
	@Exclude()
	city: string;

	@Column()
	@Exclude()
	state: string;

	@Column()
	canceled_at: Date;

	@Column()
	signature_id: string;

	@Column()
	start_date: Date;

	@Column()
	end_date: Date;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column()
	avatar: string;
}

export default Deliveries;
