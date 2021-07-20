import { Controller, Get } from '@nestjs/common';
import { UserService } from '../../service/simple';

@Controller('/api')
export class UserController {
	constructor(private readonly apiUserService: UserService) {}

	@Get('/detail/:id')
	async getDetailData() {
		const data = await this.apiUserService.findAll();
		return data;
	}
}
