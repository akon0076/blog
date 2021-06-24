import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class HTTPExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HttpException属于基础异常类
    // 如果是自定义的异常类则抛出自定义的status
    // 否则就是内置HTTP异常类，然后抛出其对应的内置Status内容
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 抛出错误信息
    // @ts-ignore
    const message =
      exception.message ||
      //   exception.message.error ||
      //   exception.message.message ||
      null;

    let msgLog = {
      statusCode: status, // 系统错误状态
      timestamp: new Date().toISOString(), // 错误日期
      path: request.url, // 错误路由
      message: '请求失败',
      data: message, // 错误消息内容体(争取和拦截器中定义的响应体一样)
    };
    // 打印错误综合日志
    Logger.error('错误信息', JSON.stringify(msgLog), 'HttpExceptionFilter');
    response.status(status).json(msgLog);
  }
}
