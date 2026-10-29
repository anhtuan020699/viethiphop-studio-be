import { Module } from '@nestjs/common';
import { MixTracksService } from './mix-tracks.service';
import { MixTracksPublicController } from './mix-tracks-public.controller';
import { MixTracksAdminController } from './mix-tracks-admin.controller';

@Module({
  controllers: [MixTracksPublicController, MixTracksAdminController],
  providers: [MixTracksService],
  exports: [MixTracksService],
})
export class MixTracksModule {}
