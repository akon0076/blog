import { Module } from '@nestjs/common';
import { UserController } from '../../controller/user';
import { UserService } from '../../service/simple';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../../entity/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  // constructor(private readonly connection: Connection) {}
}