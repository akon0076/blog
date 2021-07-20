import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { DetailController } from './detail.controller';
import { ApiDetailService } from './detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/User';
@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [DetailController, ApiController],
	providers: [ApiDetailService]
})
export class DetailModule {}
