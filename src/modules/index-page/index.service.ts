import { Injectable } from '@nestjs/common';
import mock from './index.mock';
export interface IApiService {
	index: () => Promise<any>;
}

@Injectable()
export class ApiService {
	async index(): Promise<any> {
		return await Promise.resolve(mock);
	}
}
