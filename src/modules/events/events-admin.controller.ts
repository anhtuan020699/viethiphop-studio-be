import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../helpers/enums/role.enum';

@Controller('admin/events')
@ApiTags('📰 Sự kiện & Tin tức - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class EventsAdminController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách sự kiện (Admin)',
    description: 'Lấy tất cả sự kiện kể cả những cái chưa công bố'
  })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm' })
  findAllAdmin(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll(false, category, search);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo sự kiện mới',
    description: 'Thêm một sự kiện/tin tức mới vào hệ thống'
  })
  create(@Body() data: any) {
    return this.eventsService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật sự kiện',
    description: 'Cập nhật thông tin sự kiện theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của sự kiện' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.eventsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa sự kiện',
    description: 'Xóa một sự kiện khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của sự kiện' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
