import { NestFactory } from '@nestjs/core';
import FlywayJs from 'flyway-js';
import { port, dbUrl } from '../config/server';
import { Injectable, Logger, PipeTransform } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import register from '@react-ssr/nestjs-express/register';
import { AppModule } from './app.module';

(async () => {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /** 使用SSR */
	await register(app);
  app.setViewEngine('hbs');
  

	/** 执行flyway */
	Logger.log(`执行flyway 初始化数据库环境`, process.env.NODE_ENV);
	const db_url = dbUrl[process.env.NODE_ENV as never];
	Logger.log(`/** connect to ${db_url}`, 'Database URL');

	//SQL 或者 ts，js 路径
	const sql_dir = `${process.cwd()}/src/sql`;
	await new FlywayJs(db_url, sql_dir).run();
	let flywayOptions = {
		//关闭文件hash校验，默认为false
		allowHashNotMatch: true,
		//指定数据库基准脚本文件名，默认为""
		baseline: ''
	};
	//如果 force_init 为 true 则每次请求flyway_js 表。主要为啦适配单元测试.生产 需要是 false. 单元测试时 需要为 true
	let force_init = true;
	new FlywayJs(db_url, sql_dir, force_init, flywayOptions).run();
  Logger.log('数据库更新成功', 'Database Info');
  

	app.listen(port, async () => {
		console.log(`> Ready on http://localhost:80`);
	});
})();
