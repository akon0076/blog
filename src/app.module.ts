import { Module } from '@nestjs/common';
import { DetailModule } from './modules/detail-page/detail.module';
import { IndexModule } from './modules/index-page/index.module';
import { SimpleModule } from './modules/crud';
import { User } from './modules/crud/eneity/User';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'Akon0076wagy',
			database: 'CRUD',
			entities: [User],
			synchronize: false, // 是否同步实体 为ture时会使用entities创建表
			keepConnectionAlive: true // 是否保持连接状态，如果为false，热更新会导致AlreadyHasActiveConnectionError
		}),
		DetailModule,
		IndexModule,
		SimpleModule
	]
})
export class AppModule {}
