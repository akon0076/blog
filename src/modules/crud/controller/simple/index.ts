import { Controller, Get, Post, Body } from '@nestjs/common';
import { SimpleService } from '../../service/simple';
import { UserCreatInputDTO } from '../../dto';

@Controller('crud')
export class SimpleController {
	constructor(private readonly simpleService: SimpleService) {}

	@Post('creat')
	async creat(@Body() body: UserCreatInputDTO) {
		console.log('log:: SimpleController -> creat -> body', body);
		this.simpleService.creat(body);
	}

	@Get('findAll')
	findAll() {
		this.simpleService.findAll();
	}

	@Get('query')
	query() {
		this.simpleService.query();
	}
}
