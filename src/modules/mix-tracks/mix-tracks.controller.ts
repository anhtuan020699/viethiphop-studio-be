import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { MixTracksService } from './mix-tracks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('mix-tracks')
export class MixTracksController {
  constructor(private readonly mixTracksService: MixTracksService) {}

  @Public()
  @Get()
  findAll(
    @Query('packageType') packageType?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.mixTracksService.findAll(true, packageType, category, subCategory);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin(
    @Query('packageType') packageType?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.mixTracksService.findAll(false, packageType, category, subCategory);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mixTracksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any) {
    return this.mixTracksService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.mixTracksService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mixTracksService.remove(id);
  }
}
