import { plainToClass, plainToInstance } from 'class-transformer';

import { BaseResponseDto, CurrentUserDto } from '@core/base/base.dto';
import { GetCurrentUser } from '@common/decorators/get-current-user.decorator';
import { UserEntity } from '@core/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '@common/decorators';

const prefixPath = '/auth';

@ApiTags(prefixPath)
@Controller(prefixPath)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Throttle(10, 10)
  @Public()
  @Post('/login')
  async login(@Body() request: LoginRequestDto): Promise<BaseResponseDto<any>> {
    const data = await this.authService.login(request);
    return new BaseResponseDto<any>(plainToInstance(UserEntity, data));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/my-profile')
  async myProfile(
    @GetCurrentUser() currentUser: CurrentUserDto,
  ): Promise<BaseResponseDto<UserEntity>> {
    const user = await this.userService.findById(currentUser.id);
    return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, user));
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/register')
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<BaseResponseDto<UserEntity>> {
    const user = await this.userService._store(registerRequestDto);
    return new BaseResponseDto<UserEntity>(plainToClass(UserEntity, user));
  }
}
