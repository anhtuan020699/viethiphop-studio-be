import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BeatsService } from './beats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../helpers/enums/role.enum';

@Controller('admin/beats')
@ApiTags('🎵 Quản lý Beat - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class BeatsAdminController {
  constructor(private readonly beatsService: BeatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách beat (Admin)',
    description: 'Lấy tất cả beat kể cả những cái chưa publish'
  })
  @ApiQuery({ name: 'genre', required: false, description: 'Lọc theo thể loại' })
  @ApiQuery({ name: 'subgenre', required: false, description: 'Lọc theo thể loại phụ' })
  @ApiQuery({ name: 'typeBeat', required: false, description: 'Lọc theo loại beat' })
  findAllAdmin(
    @Query('genre') genre?: string,
    @Query('subgenre') subgenre?: string,
    @Query('hiphopDong') hiphopDong?: string,
    @Query('typeBeat') typeBeat?: string,
    @Query('hiphopType') hiphopType?: string,
  ) {
    return this.beatsService.findAll(false, genre, subgenre || hiphopDong, typeBeat || hiphopType);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo beat mới',
    description: 'Thêm một beat mới vào hệ thống'
  })
  create(@Body() data: any) {
    return this.beatsService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Cập nhật beat',
    description: 'Cập nhật thông tin beat theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của beat' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.beatsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa beat',
    description: 'Xóa một beat khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của beat' })
  remove(@Param('id') id: string) {
    return this.beatsService.remove(id);
  }
}
