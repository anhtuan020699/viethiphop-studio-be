import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('events')
@ApiTags('📰 Quản lý Sự kiện & Tin tức')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sự kiện', description: 'Lấy tất cả sự kiện/tin tức đang công bố' })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục (Sự kiện/Tin tức/Workshop)' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm theo tên hoặc nội dung' })
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll(true, category, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Lấy danh sách sự kiện (Admin)', description: 'Lấy tất cả sự kiện kể cả những cái chưa công bố' })
  findAllAdmin(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll(false, category, search);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết sự kiện', description: 'Lấy thông tin chi tiết một sự kiện theo slug hoặc ID' })
  @ApiParam({ name: 'slug', description: 'Slug hoặc ID của sự kiện' })
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findBySlugOrId(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Tạo sự kiện mới', description: 'Thêm một sự kiện/tin tức mới vào hệ thống' })
  create(@Body() data: any) {
    return this.eventsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật sự kiện', description: 'Cập nhật thông tin sự kiện theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sự kiện' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.eventsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sự kiện', description: 'Xóa một sự kiện khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của sự kiện' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
