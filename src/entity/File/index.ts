import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'crt_time' })
	crtTime: number;

	@Column({ name: 'upd_time' })
	updTime: number;

	@Column({ name: 'atc_id' })
	atcId: number;

	@Column()
	name: string;

	@Column()
	type: string;

	@Column({ name: 'is_delete' })
	isDelete: number;

	@Column({ name: 'parent_id' })
	parentId: string;
}
