import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import FlywayJs from 'flyway-js';
import {
  Injectable,
  Logger,
  PipeTransform,
  // ValidationPipe,
} from '@nestjs/common';
import { port, dbUrl } from '../config/server';
import { ValidationPipe } from './validationPipe';
const express = require('express');
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  // 允许跨域
  app.enableCors({});

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // 可以直接访问文件 如：http://localhost:3000/public/uploads/2020-04-15/36T4NJ0P3UQCIU3GFRMARZ.jpeg
  // 配置 public 文件夹为静态目录，以达到可直接访问下面文件的目的
  const rootDir = join(__dirname, '..');
  app.use('/public', express.static(join(rootDir, 'public')));

  /** 添加DTO校验管道 */
  app.useGlobalPipes(new ValidationPipe());

  // 设置所有 api 访问前缀
  // app.setGlobalPrefix('/api');

  // 使用全局拦截器打印出参 TransformInterceptor
  // app.useGlobalInterceptors(new TransformStream()); // TODO 待找到对应的包

  // 过滤处理 HTTP 异常
  // AllExceptionsFilter 要在 HttpExceptionFilter 的上面，

  // 否则 HttpExceptionFilter 就不生效了，全被 AllExceptionsFilter 捕获了
  // app.useGlobalFilters(new AllExceptionFilter()); // TODO 待找到对应的包
  // app.useGlobalFilters(new HttpExceptionFilter()); // TODO 待找到对应的包

  // 接口文档 swagger 参数
  const options = new DocumentBuilder()
    .setTitle('角色权限管理')
    .setDescription('角色权限')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  /** 执行flyway */
  Logger.log(`执行flyway 初始化数据库`, 'database');
  const db_url = dbUrl[process.env.NODE_ENV];
  Logger.log(`/** connect to ${db_url}`, 'database');

  //SQL 或者 ts，js 路径
  const sql_dir = `${process.cwd()}/src/sql`;
  await new FlywayJs(db_url, sql_dir).run();
  let flywayOptions = {
    //关闭文件hash校验，默认为false
    allowHashNotMatch: true,
    //指定数据库基准脚本文件名，默认为""
    baseline: '',
  };
  //如果 force_init 为 true 则每次请求flyway_js 表。主要为啦适配单元测试.生产 需要是 false. 单元测试时 需要为 true
  let force_init = true;
  new FlywayJs(db_url, sql_dir, force_init, flywayOptions).run();
  Logger.log('数据库更新成功', 'database');

  await app.listen(port);
  Logger.log(`http://localhost:${port}`, '服务启动成功');
}
bootstrap();
