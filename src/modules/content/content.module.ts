import { Module } from '@nestjs/common';
import { ContentPublicController } from './content-public.controller';
import { ContentAdminController } from './content-admin.controller';
import { ContentService } from './content.service';

@Module({
  controllers: [ContentPublicController, ContentAdminController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
