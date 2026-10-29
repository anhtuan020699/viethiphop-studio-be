import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutPublicController } from './about-public.controller';
import { AboutAdminController } from './about-admin.controller';

@Module({
  controllers: [AboutPublicController, AboutAdminController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}
