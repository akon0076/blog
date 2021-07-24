import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article, File } from '../../entity';
import { getUUId } from '../../tool';

export interface IApiService {
	index: () => Promise<any>;
}

@Injectable()
export class ApiService {
	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,

		@InjectRepository(File)
		private readonly fileRepository: Repository<File>
	) {}

	async getPage() {
		return await this.articleRepository.find();
	}

	async savePage(params: { page: Article }) {
		const { page } = params;
		this.articleRepository.save({
			id: getUUId(),
			...page
		});
	}

	async saveFile(params: { file: File }) {
		const { file } = params;
		const record = {
			...file,
			id: file.id || getUUId()
		};
		this.fileRepository.save(record);
	}

	async getFile(params?: { id: string }) {
		return await this.fileRepository.find();
	}
}
