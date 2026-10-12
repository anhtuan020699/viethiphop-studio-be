import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll(true, category, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll(false, category, search);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findBySlugOrId(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any) {
    return this.eventsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.eventsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
