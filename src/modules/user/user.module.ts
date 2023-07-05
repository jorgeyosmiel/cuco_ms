import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@core/entities/user.entity';

import { AdminUserController } from './controller/admin.user.controller';
import { UserController } from './controller/user.controller';
import { UserSubscriber } from './subscriber/user.subscriber';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService, UserSubscriber, UserRepository, Logger],
  exports: [UserService],
})
export class UserModule {}
