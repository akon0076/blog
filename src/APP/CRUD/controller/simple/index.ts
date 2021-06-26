import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Query,
  Post,
  Res,
  Put,
  Body,
  UsePipes,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SimpleService } from '../../service/simple';
import { User } from '../../eneity/User';
import { commonApi } from '../../../../type';
import { get } from 'http';
import { UserCreatInputDTO } from 'localSrc/APP/CRUD/dto';

@Controller('')
export class SimpleController {
  constructor(private readonly simpleService: SimpleService) {}

  @Get('')
  defaultReturn() {
    return '李娅楠是傻逼！！！';
  }

  @Post('creat')
  async creat(@Body() body: UserCreatInputDTO) {
    console.log('log:: SimpleController -> creat -> body', body);
    this.simpleService.creat(body);
  }

  @Get('findAll')
  findAll() {
    this.simpleService.findAll();
  }

  @Get('query')
  query() {
    this.simpleService.query();
  }
}
