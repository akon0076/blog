import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimpleModule } from './crud';
import { User } from './crud/eneity/User';

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
		SimpleModule
	],
	controllers: [AppController]
})
export class AppModule {}
