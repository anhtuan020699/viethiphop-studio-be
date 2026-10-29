import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BeatsService } from './beats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('beats')
@ApiTags('🎵 Quản lý Beat')
export class BeatsController {
  constructor(private readonly beatsService: BeatsService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách beat', description: 'Lấy tất cả beat đang có sẵn để mua' })
  @ApiQuery({ name: 'genre', required: false, description: 'Lọc theo thể loại (Genre)' })
  @ApiQuery({ name: 'subgenre', required: false, description: 'Lọc theo thể loại phụ' })
  @ApiQuery({ name: 'typeBeat', required: false, description: 'Lọc theo loại beat' })
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
  @ApiOperation({ summary: 'Lấy danh sách beat (Admin)', description: 'Lấy tất cả beat kể cả những cái chưa publish' })
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
  @ApiOperation({ summary: 'Lấy chi tiết beat', description: 'Lấy thông tin chi tiết một beat theo ID' })
  @ApiParam({ name: 'id', description: 'ID của beat' })
  findOne(@Param('id') id: string) {
    return this.beatsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Tạo beat mới', description: 'Thêm một beat mới vào hệ thống' })
  create(@Body() data: any) {
    return this.beatsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật beat', description: 'Cập nhật thông tin beat theo ID' })
  @ApiParam({ name: 'id', description: 'ID của beat' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.beatsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa beat', description: 'Xóa một beat khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của beat' })
  remove(@Param('id') id: string) {
    return this.beatsService.remove(id);
  }
}
