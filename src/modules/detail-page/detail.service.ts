import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';
// import { UserCreatInputDTO } from '../blog/dto';

@Injectable()
export class ApiDetailService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async findAll(): Promise<User[]> {
		const res = await this.userRepository.find();
		console.log('log:: SimpleService -> res', res);
		return res;
	}

	creat(body) {
		console.log('creat', body);
		this.userRepository.save(body);
	}

	async query() {
		const res = await this.userRepository.query('select * from user where user.id in (?, ?)', [1, 2]);
		console.log('res', res);
	}
}
