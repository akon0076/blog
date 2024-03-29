import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@Column({ name: 'crt_time' })
	crtTime: number;

	@Column({ name: 'upd_time' })
	updTime: number;

	@Column({ name: 'user_id' })
	userId: number;

	@Column()
	title: string;
}
