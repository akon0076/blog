import { Controller, Query, Body, Get, Put } from '@nestjs/common';
import { ApiService } from './index.service';
import { ISavePage, ISaveFile } from './@types';

@Controller('/api')
export class ApiController {
	constructor(private readonly apiService: ApiService) {}

	@Put('/page')
	async savePage(@Body() body: ISavePage) {
		await this.apiService.savePage({ page: body as any });
	}

	@Get('/page')
	async getPage(@Query() params) {
		const res = await this.apiService.getPage();
		return res;
	}
	@Put('/file')
	async saveFile(@Body() body: ISaveFile) {
		try {
			const newNode = await this.apiService.saveFile({
				file: body as any
			});
			return newNode;
		} catch (e) {
			console.log(e);
		}
	}

	@Get('/file')
	async getFile(@Query() params) {
		return this.apiService.getFile();
	}
}
