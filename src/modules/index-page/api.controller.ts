import { Controller, Post, Body } from '@nestjs/common';
import { ApiService } from './index.service';
import { ISavePage } from './@types';

@Controller('/api')
export class ApiController {
	constructor(private readonly apiService: ApiService) {}

	@Post('/savePage')
	async savePage(@Body() body: ISavePage) {
		console.log('log: ~ file: api.controller.ts ~ line 11 ~ ApiController ~ savePage ~ body', body);
		await this.apiService.savePage({ page: body as any });
	}
}
