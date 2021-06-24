import { Module } from '@nestjs/common';
import { FileModule, SimpleModule } from './APP';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './APP/CRUD/eneity/User';
import { jdbc } from '../config/server';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...jdbc,
      entities: [User],
    }),
    SimpleModule,
    FileModule,
  ],
})
export class AppModule {}
