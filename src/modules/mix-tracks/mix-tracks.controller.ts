import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MixTracksService } from './mix-tracks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('mix-tracks')
@ApiTags('🎚️ Quản lý Bản ghi Mix')
export class MixTracksController {
  constructor(private readonly mixTracksService: MixTracksService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bản ghi mix', description: 'Lấy tất cả bản ghi mix đang có sẵn' })
  @ApiQuery({ name: 'packageType', required: false, description: 'Lọc theo loại package (Cơ bản/Nâng cao/Chuyên nghiệp)' })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục' })
  @ApiQuery({ name: 'subCategory', required: false, description: 'Lọc theo thể loại con' })
  findAll(
    @Query('packageType') packageType?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.mixTracksService.findAll(true, packageType, category, subCategory);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Lấy danh sách bản ghi mix (Admin)', description: 'Lấy tất cả bản ghi mix kể cả những cái chưa công bố' })
  findAllAdmin(
    @Query('packageType') packageType?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.mixTracksService.findAll(false, packageType, category, subCategory);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết bản ghi mix', description: 'Lấy thông tin chi tiết một bản ghi mix theo ID' })
  @ApiParam({ name: 'id', description: 'ID của bản ghi mix' })
  findOne(@Param('id') id: string) {
    return this.mixTracksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Tạo bản ghi mix mới', description: 'Thêm một bản ghi mix mới vào hệ thống' })
  create(@Body() data: any) {
    return this.mixTracksService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật bản ghi mix', description: 'Cập nhật thông tin bản ghi mix theo ID' })
  @ApiParam({ name: 'id', description: 'ID của bản ghi mix' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.mixTracksService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bản ghi mix', description: 'Xóa một bản ghi mix khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của bản ghi mix' })
  remove(@Param('id') id: string) {
    return this.mixTracksService.remove(id);
  }
}
