import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { MixTracksService } from './mix-tracks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../helpers/enums/role.enum';

@Controller('admin/mix-tracks')
@ApiTags('🎚️ Bản ghi Mix - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class MixTracksAdminController {
  constructor(private readonly mixTracksService: MixTracksService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách bản ghi mix (Admin)',
    description: 'Lấy tất cả bản ghi mix kể cả những cái chưa công bố'
  })
  @ApiQuery({ name: 'packageType', required: false, description: 'Lọc theo loại package' })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục' })
  @ApiQuery({ name: 'subCategory', required: false, description: 'Lọc theo thể loại con' })
  findAllAdmin(
    @Query('packageType') packageType?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.mixTracksService.findAll(false, packageType, category, subCategory);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo bản ghi mix mới',
    description: 'Thêm một bản ghi mix mới vào hệ thống'
  })
  create(@Body() data: any) {
    return this.mixTracksService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật bản ghi mix',
    description: 'Cập nhật thông tin bản ghi mix theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của bản ghi mix' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.mixTracksService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa bản ghi mix',
    description: 'Xóa một bản ghi mix khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của bản ghi mix' })
  remove(@Param('id') id: string) {
    return this.mixTracksService.remove(id);
  }
}
