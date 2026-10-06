import { Injectable, Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import r2Config from '../../config/r2.config';
import * as path from 'path';
import 'multer';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3Client: S3Client;

  constructor(
    @Inject(r2Config.KEY)
    private readonly r2Opts: ConfigType<typeof r2Config>,
  ) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.r2Opts.endpoint!,
      credentials: {
        accessKeyId: this.r2Opts.accessKeyId!,
        secretAccessKey: this.r2Opts.secretAccessKey!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    try {
      const ext = path.extname(file.originalname);
      const filename = `${folder}/${uuidv4()}${ext}`;

      const command = new PutObjectCommand({
        Bucket: this.r2Opts.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // Return public URL
      return `${this.r2Opts.publicDomain}/${filename}`;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload file: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Failed to upload file to storage');
    }
  }
}
