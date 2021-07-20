import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../entity/Article';
import { getUUId } from '../../tool';

export interface IApiService {
	index: () => Promise<any>;
}

@Injectable()
export class ApiService {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>
	) {}

	async savePage(params: { page: Article }) {
		const { page } = params;
		this.articleRepository.save({
			id: getUUId(),
			...page
		});
	}
}
