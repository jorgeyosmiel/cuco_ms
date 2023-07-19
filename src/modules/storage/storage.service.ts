import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';

//Below modules are needed for file processing
import * as fs from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
const pump = promisify(pipeline);

const s3 = new AWS.S3();

@Injectable()
export class StorageService {
  constructor(private configService: ConfigService, private logger: Logger) {}

  async fileUploadLocal(data: any): Promise<any> {
    console.log('AAAAAAAAAA', { data });

    try {
      await pump(
        data.file,
        fs.createWriteStream(
          `${this.configService.get('upload_local')}/file-${v4()}-${
            data.filename
          }`,
        ),
      );
      return 'Data uploaded successfully';
    } catch (error) {}
  }

  async fileUploadS3(
    fileBuffer: any,
    name: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    try {
      const fileName = `file-${v4()}-${name}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.configService.get('aws_bucket_name'),
        Key: fileName,
        Body: fileBuffer,
        ACL: 'public-read',
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err.message);
            throw new Error(`Error: ${err.message}`);
          }

          delete data.Bucket;
          delete data.ETag;
          delete data.Key;
          //delete data.Location;

          const dataS3 = {
            ...data,
            filename: fileName,
          };

          resolve(dataS3);
        });
      });
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
