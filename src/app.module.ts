import { Module } from '@nestjs/common';
import { DetailModule } from './modules/detail-page/detail.module';
import { IndexModule } from './modules/index-page/index.module';
import { UserModule } from './modules';
import { User, Article } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'Akon0076wagy',
			database: 'blog',
			entities: [User, Article],
			synchronize: false, // 是否同步实体 为ture时会使用entities创建表
			keepConnectionAlive: true // 是否保持连接状态，如果为false，热更新会导致AlreadyHasActiveConnectionError
		}),
		DetailModule,
		IndexModule,
		UserModule
	]
})
export class AppModule {}
