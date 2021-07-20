import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@Column()
	crt_time: number;

	@Column()
	upd_time: number;

	@Column()
	user_id: number;
}
