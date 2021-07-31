import { Injectable, UsePipes } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article, File } from '../../entity';
import { getUUId } from '../../utils/tool';
import { LogPipes } from 'src/pipes/log.pipe';
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
		await this.fileRepository.save(record);
		return await this.fileRepository.find({ id: record.id });
	}

	@UsePipes(new LogPipes())
	async getFile(params?: { id: string }) {
		console.log('getFile');
		return await this.fileRepository.find();
	}
}
