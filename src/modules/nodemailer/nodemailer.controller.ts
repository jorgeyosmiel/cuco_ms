import { BaseResponseDto } from '@core/base/base.dto';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { NodemailerService } from './nodemailer.service';

const prefixPath = '/nodemailer';

@ApiTags(prefixPath)
@Controller(prefixPath)
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) {}
  @Get()
  async test(): Promise<BaseResponseDto<any>> {
    await this.nodemailerService.example();
    return new BaseResponseDto<any>();
  }
  @Get('queue')
  async queue(): Promise<BaseResponseDto<any>> {
    await this.nodemailerService.sendMailwithQueue('data');
    return new BaseResponseDto<any>();
  }
}
