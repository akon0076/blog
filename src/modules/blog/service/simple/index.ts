import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entity/User';
import { UserCreatInputDTO } from '../../dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}
	async findAll(): Promise<User[]> {
		const res = await this.userRepository.find();
		console.log('log:: SimpleService -> res', res);
		return res;
	}
	creat(body: UserCreatInputDTO) {
		console.log('creat', body);
		this.userRepository.save(body);
	}
	async query() {
		const res = await this.userRepository.query('select * from user where user.id in (?, ?)', [1, 2]);
		console.log('res', res);
	}
}
