import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initialSSRDevProxy, loadConfig, getCwd } from 'ssr-server-utils';
import { dbUrl } from '../config/server';
import FlywayJs from 'flyway-js';
import { ValidationPipe } from './validationPipe';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	await initialSSRDevProxy(app, {
		express: true
	});
	app.useStaticAssets(join(getCwd(), './build'));

	/** 添加DTO校验 */
	app.useGlobalPipes(new ValidationPipe());

	/** 执行flyway */
	Logger.log(`执行flyway 初始化数据库`, 'database');
	const db_url = dbUrl[process.env.NODE_ENV];
	Logger.log(`/** connect to ${db_url}`, 'database');

	/** SQL 或者 TS，JS 路径 */
	const sql_dir = `${process.cwd()}/src/sql`;
	await new FlywayJs(db_url, sql_dir).run();
	let flywayOptions = {
		/** 关闭文件hash校验，默认为false */
		allowHashNotMatch: true,
		/** 指定数据库基准脚本文件名，默认为"" */
		baseline: ''
	};
	//如果 force_init 为 true 则每次请求flyway_js 表。主要为啦适配单元测试.生产 需要是 false. 单元测试时 需要为 true
	let forceInit = true;
	new FlywayJs(db_url, sql_dir, forceInit, flywayOptions).run();
	Logger.log('数据库更新成功', 'database');

	const { serverPort } = loadConfig();
	await app.listen(serverPort);
}

bootstrap().catch(err => {
	console.log(err);
	process.exit(1);
});
