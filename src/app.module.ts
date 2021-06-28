import { Module } from '@nestjs/common';
import { FileModule, SimpleModule } from './server';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './server/CRUD/eneity/User';
import { jdbc } from '../config/server';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      ...jdbc,
      entities: [User],
    }),
    // SimpleModule,
    // FileModule,
  ],
})
export class AppModule {}
