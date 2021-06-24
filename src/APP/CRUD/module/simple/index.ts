import { Module } from '@nestjs/common';
import { SimpleController } from '../../controller/simple';
import { SimpleService } from '../../service/simple';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from '../../eneity/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SimpleController],
  providers: [SimpleService],
})
export class SimpleModule {
  constructor(private readonly connection: Connection) {}
}