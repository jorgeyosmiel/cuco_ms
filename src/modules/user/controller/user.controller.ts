import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseResponseDto, CurrentUserDto } from '@core/base/base.dto';
import { GetCurrentUser } from '@common/decorators/get-current-user.decorator';
import { UserEntity } from '@core/entities/user.entity';

import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../user.service';

const prefixPath = '/user';

@ApiTags(prefixPath)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller(prefixPath)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/my-profile')
  async myProfile(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
  ): Promise<BaseResponseDto<UserEntity>> {
    const user = await this.userService.findById(currentUserDto.id);
    return new BaseResponseDto<UserEntity>(plainToInstance(UserEntity, user));
  }

  @Patch('/update-profile')
  async updateProfile(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<UserEntity>> {
    const data = await this.userService.updateProfile(
      currentUserDto.id,
      updateUserDto,
    );
    return new BaseResponseDto<UserEntity>(plainToInstance(UserEntity, data));
  }

  @Post('/change-password')
  async changePassword(
    @GetCurrentUser() currentUserDto: CurrentUserDto,
    @Body() password: ChangePasswordDto,
  ): Promise<BaseResponseDto<UserEntity>> {
    const user = await this.userService.changePassword(
      currentUserDto.id,
      password,
    );
    return new BaseResponseDto<UserEntity>(user);
  }
}
