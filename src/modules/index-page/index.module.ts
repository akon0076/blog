import { Module } from '@nestjs/common';
import { AppController } from './index.controller';
import { ApiController } from './api.controller';
import { ApiService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article, File } from '../../entity';
@Module({
	imports: [TypeOrmModule.forFeature([Article, File])],
	controllers: [AppController, ApiController],
	providers: [ApiService]
})
export class IndexModule {}
