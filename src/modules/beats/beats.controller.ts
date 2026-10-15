import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { BeatsService } from './beats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('beats')
export class BeatsController {
  constructor(private readonly beatsService: BeatsService) { }

  @Public()
  @Get()
  findAll(
    @Query('genre') genre?: string,
    @Query('subgenre') subgenre?: string,
    @Query('hiphopDong') hiphopDong?: string,
    @Query('typeBeat') typeBeat?: string,
    @Query('hiphopType') hiphopType?: string,
  ) {
    return this.beatsService.findAll(true, genre, subgenre || hiphopDong, typeBeat || hiphopType);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin(
    @Query('genre') genre?: string,
    @Query('subgenre') subgenre?: string,
    @Query('hiphopDong') hiphopDong?: string,
    @Query('typeBeat') typeBeat?: string,
    @Query('hiphopType') hiphopType?: string,
  ) {
    return this.beatsService.findAll(false, genre, subgenre || hiphopDong, typeBeat || hiphopType);
  }

  @Public()
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
