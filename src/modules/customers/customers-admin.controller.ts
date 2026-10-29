import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../helpers/enums/role.enum';

@Controller('admin/customers')
@ApiTags('🏆 Khách hàng & Bảng xếp hạng - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CustomersAdminController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy thông tin khách hàng (Admin)',
    description: 'Lấy tất cả dữ liệu khách hàng kể cả những cái chưa công bố'
  })
  @ApiQuery({ name: 'year', required: false, description: 'Năm cần lấy dữ liệu' })
  findAdmin(@Query('year') year?: string) {
    return this.customersService.findAdmin(year ? Number(year) : undefined);
  }

  // --- RANKINGS ---
  @Post('rankings')
  @ApiOperation({
    summary: 'Tạo bảng xếp hạng mới',
    description: 'Thêm khách hàng vào bảng xếp hạng'
  })
  createRanking(@Body() data: any) {
    return this.customersService.createRanking(data);
  }

  @Put('rankings/:id')
  @ApiOperation({
    summary: 'Cập nhật thông tin xếp hạng',
    description: 'Cập nhật vị trí hoặc thông tin khách hàng trong bảng xếp hạng'
  })
  @ApiParam({ name: 'id', description: 'ID của bản ghi xếp hạng' })
  updateRanking(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateRanking(id, data);
  }

  @Delete('rankings/:id')
  @ApiOperation({
    summary: 'Xóa bảng xếp hạng',
    description: 'Xóa khách hàng khỏi bảng xếp hạng'
  })
  @ApiParam({ name: 'id', description: 'ID của bản ghi xếp hạng' })
  removeRanking(@Param('id') id: string) {
    return this.customersService.removeRanking(id);
  }

  // --- HIGHLIGHTS ---
  @Post('highlights')
  @ApiOperation({
    summary: 'Thêm Highlight mới',
    description: 'Thêm một highlight (sự kiện nổi bật) của khách hàng'
  })
  createHighlight(@Body() data: any) {
    return this.customersService.createHighlight(data);
  }

  @Put('highlights/:id')
  @ApiOperation({
    summary: 'Cập nhật Highlight',
    description: 'Cập nhật thông tin highlight của khách hàng'
  })
  @ApiParam({ name: 'id', description: 'ID của highlight' })
  updateHighlight(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateHighlight(id, data);
  }

  @Delete('highlights/:id')
  @ApiOperation({
    summary: 'Xóa Highlight',
    description: 'Xóa một highlight khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của highlight' })
  removeHighlight(@Param('id') id: string) {
    return this.customersService.removeHighlight(id);
  }

  // --- CLIPS ---
  @Post('clips')
  @ApiOperation({
    summary: 'Thêm Clip mới',
    description: 'Thêm một clip video phản hồi hoặc demo của khách hàng'
  })
  createClip(@Body() data: any) {
    return this.customersService.createClip(data);
  }

  @Put('clips/:id')
  @ApiOperation({
    summary: 'Cập nhật Clip',
    description: 'Cập nhật thông tin clip video'
  })
  @ApiParam({ name: 'id', description: 'ID của clip' })
  updateClip(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateClip(id, data);
  }

  @Delete('clips/:id')
  @ApiOperation({
    summary: 'Xóa Clip',
    description: 'Xóa một clip khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của clip' })
  removeClip(@Param('id') id: string) {
    return this.customersService.removeClip(id);
  }
}
