import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('customers')
@ApiTags('🏆 Quản lý Khách hàng & Bảng xếp hạng')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy thông tin khách hàng', description: 'Lấy bảng xếp hạng, highlight và clips của năm' })
  @ApiQuery({ name: 'year', required: false, description: 'Năm cần lấy dữ liệu (mặc định 2026)' })
  findPublic(@Query('year') year?: string) {
    return this.customersService.findPublic(year ? Number(year) : 2026);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  @ApiOperation({ summary: 'Lấy thông tin khách hàng (Admin)', description: 'Lấy tất cả dữ liệu khách hàng kể cả những cái chưa công bố' })
  @ApiQuery({ name: 'year', required: false, description: 'Năm cần lấy dữ liệu' })
  findAdmin(@Query('year') year?: string) {
    return this.customersService.findAdmin(year ? Number(year) : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rankings')
  @ApiOperation({ summary: 'Tạo bảng xếp hạng mới', description: 'Thêm khách hàng vào bảng xếp hạng' })
  createRanking(@Body() data: any) {
    return this.customersService.createRanking(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('rankings/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin xếp hạng', description: 'Cập nhật vị trí hoặc thông tin khách hàng trong bảng xếp hạng' })
  @ApiParam({ name: 'id', description: 'ID của bản ghi xếp hạng' })
  updateRanking(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateRanking(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('rankings/:id')
  @ApiOperation({ summary: 'Xóa bảng xếp hạng', description: 'Xóa khách hàng khỏi bảng xếp hạng' })
  @ApiParam({ name: 'id', description: 'ID của bản ghi xếp hạng' })
  removeRanking(@Param('id') id: string) {
    return this.customersService.removeRanking(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('highlights')
  @ApiOperation({ summary: 'Thêm Highlight mới', description: 'Thêm một highlight (sự kiện nổi bật) của khách hàng' })
  createHighlight(@Body() data: any) {
    return this.customersService.createHighlight(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('highlights/:id')
  @ApiOperation({ summary: 'Cập nhật Highlight', description: 'Cập nhật thông tin highlight của khách hàng' })
  @ApiParam({ name: 'id', description: 'ID của highlight' })
  updateHighlight(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateHighlight(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('highlights/:id')
  @ApiOperation({ summary: 'Xóa Highlight', description: 'Xóa một highlight khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của highlight' })
  removeHighlight(@Param('id') id: string) {
    return this.customersService.removeHighlight(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('clips')
  @ApiOperation({ summary: 'Thêm Clip mới', description: 'Thêm một clip video phản hồi hoặc demo của khách hàng' })
  createClip(@Body() data: any) {
    return this.customersService.createClip(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('clips/:id')
  @ApiOperation({ summary: 'Cập nhật Clip', description: 'Cập nhật thông tin clip video' })
  @ApiParam({ name: 'id', description: 'ID của clip' })
  updateClip(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateClip(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('clips/:id')
  @ApiOperation({ summary: 'Xóa Clip', description: 'Xóa một clip khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của clip' })
  removeClip(@Param('id') id: string) {
    return this.customersService.removeClip(id);
  }
}
