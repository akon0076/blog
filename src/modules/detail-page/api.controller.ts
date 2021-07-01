import { Controller, Get } from '@nestjs/common';
import { ApiDetailService } from './detail.service';

@Controller('/api')
export class ApiController {
	constructor(private readonly apiDetailService: ApiDetailService) {}

	@Get('/detail/:id')
	async getDetailData() {
		const data = await this.apiDetailService.findAll();
		return data;
	}
}
