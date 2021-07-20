import { Module } from '@nestjs/common';
import { AppController } from './index.controller';
import { ApiController } from './api.controller';
import { ApiService } from './index.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../../entity';
@Module({
	imports: [TypeOrmModule.forFeature([Article])],
	controllers: [AppController, ApiController],
	providers: [ApiService]
})
export class IndexModule {}
