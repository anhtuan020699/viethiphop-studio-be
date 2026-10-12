import { Module } from '@nestjs/common';
import { MixTracksService } from './mix-tracks.service';
import { MixTracksController } from './mix-tracks.controller';

@Module({
  controllers: [MixTracksController],
  providers: [MixTracksService],
  exports: [MixTracksService],
})
export class MixTracksModule {}
