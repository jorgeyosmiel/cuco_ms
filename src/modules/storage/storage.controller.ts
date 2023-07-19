import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as util from 'util';
import * as fs from 'fs';
import stream = require('stream');

@Controller('/upload')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('/local')
  async uploadLocalController(@Req() req, @Res() res: FastifyReply) {
    try {
      const data = await req.body.file;
      const dataUpload = this.storageService.fileUploadLocal(data);
      return res.status(HttpStatus.OK).send(dataUpload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('/s3')
  async uploadS3Controller(@Req() req, @Res() res: FastifyReply): Promise<any> {
    try {
      const data = await req.body.file;
      const buffer = await data.toBuffer();
      const dataUpload = await this.storageService.fileUploadS3(
        buffer,
        data.filename,
      );

      return res.status(HttpStatus.OK).send(dataUpload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async handler(
    field: string,
    file: any,
    filename: string,
    encoding: string,
    mimetype: string,
  ): Promise<void> {
    const pipeline = util.promisify(stream.pipeline);
    const writeStream = fs.createWriteStream(`uploads/${filename}`); //File path
    try {
      await pipeline(file, writeStream);
    } catch (err) {
      console.error('Pipeline failed', err);
    }
  }
}
