import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { BeatsService } from './beats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('beats')
export class BeatsController {
  constructor(private readonly beatsService: BeatsService) { }

  @Get()
  findAll() {
    return this.beatsService.findAll(true); // Return active beats for public
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.beatsService.findAll(false);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beatsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any) {
    return this.beatsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.beatsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.beatsService.remove(id);
  }
}
