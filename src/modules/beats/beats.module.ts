import { Module } from '@nestjs/common';
import { BeatsService } from './beats.service';
import { BeatsPublicController } from './beats-public.controller';
import { BeatsAdminController } from './beats-admin.controller';

@Module({
  controllers: [BeatsPublicController, BeatsAdminController],
  providers: [BeatsService],
})
export class BeatsModule {}
