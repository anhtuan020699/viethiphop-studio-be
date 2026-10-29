import { Module } from '@nestjs/common';
import { EventsPublicController } from './events-public.controller';
import { EventsAdminController } from './events-admin.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventsPublicController, EventsAdminController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
