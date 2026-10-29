import { Controller, Post, Put, Delete, Body, Param, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../helpers/enums/role.enum';

@Controller('admin/content')
@ApiTags('📝 Quản lý nội dung - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ContentAdminController {
  constructor(private readonly contentService: ContentService) {}

  // --- SETTINGS (Admin Read & Write) ---
  @Get('settings')
  @ApiOperation({
    summary: 'Lấy cài đặt (Admin)',
    description: 'Lấy danh sách các cài đặt chung của website'
  })
  getSettings() {
    return this.contentService.getSettings();
  }

  @Put('settings')
  @ApiOperation({
    summary: 'Cập nhật cài đặt',
    description: 'Cập nhật giá trị một cài đặt theo key'
  })
  updateSetting(@Body() data: { key: string; value: string }) {
    return this.contentService.updateSetting(data.key, data.value);
  }

  // --- SERVICES (Admin CRUD) ---
  @Get('services')
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ (Admin)',
    description: 'Lấy tất cả dịch vụ'
  })
  getServices() {
    return this.contentService.getServices();
  }

  @Post('services')
  @ApiOperation({
    summary: 'Tạo dịch vụ mới',
    description: 'Tạo một dịch vụ mới trong hệ thống'
  })
  createService(@Body() data: any) {
    return this.contentService.createService(data);
  }

  @Put('services/:id')
  @ApiOperation({
    summary: 'Cập nhật dịch vụ',
    description: 'Cập nhật thông tin dịch vụ theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của dịch vụ' })
  updateService(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateService(id, data);
  }

  @Delete('services/:id')
  @ApiOperation({
    summary: 'Xóa dịch vụ',
    description: 'Xóa một dịch vụ khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của dịch vụ' })
  deleteService(@Param('id') id: string) {
    return this.contentService.deleteService(id);
  }

  // --- MEDIA (Admin CRUD) ---
  @Get('media')
  @ApiOperation({
    summary: 'Lấy danh sách media (Admin)',
    description: 'Lấy tất cả hình ảnh/media'
  })
  getMedia() {
    return this.contentService.getMedia();
  }

  @Post('media')
  @ApiOperation({
    summary: 'Tạo media mới',
    description: 'Thêm một hình ảnh hoặc media mới'
  })
  createMedia(@Body() data: any) {
    return this.contentService.createMedia(data);
  }

  @Put('media/:id')
  @ApiOperation({
    summary: 'Cập nhật media',
    description: 'Cập nhật thông tin hình ảnh/media theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của media' })
  updateMedia(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateMedia(id, data);
  }

  @Delete('media/:id')
  @ApiOperation({
    summary: 'Xóa media',
    description: 'Xóa một hình ảnh hoặc media khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của media' })
  deleteMedia(@Param('id') id: string) {
    return this.contentService.deleteMedia(id);
  }

  // --- FAQS (Admin CRUD) ---
  @Get('faqs')
  @ApiOperation({
    summary: 'Lấy danh sách FAQ (Admin)',
    description: 'Lấy tất cả FAQ kể cả những cái đang ẩn'
  })
  getFaqs() {
    return this.contentService.getAllFaqs();
  }

  @Post('faqs')
  @ApiOperation({
    summary: 'Tạo FAQ mới',
    description: 'Thêm một câu hỏi thường gặp mới vào hệ thống'
  })
  createFaq(@Body() data: any) {
    return this.contentService.createFaq(data);
  }

  @Put('faqs/:id')
  @ApiOperation({
    summary: 'Cập nhật FAQ',
    description: 'Cập nhật nội dung câu hỏi hoặc câu trả lời theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của FAQ' })
  updateFaq(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateFaq(id, data);
  }

  @Delete('faqs/:id')
  @ApiOperation({
    summary: 'Xóa FAQ',
    description: 'Xóa một câu hỏi thường gặp khỏi hệ thống'
  })
  @ApiParam({ name: 'id', description: 'ID của FAQ' })
  deleteFaq(@Param('id') id: string) {
    return this.contentService.deleteFaq(id);
  }

  // --- CONSULTATIONS (Admin Read & Update Status) ---
  @Get('consultations')
  @ApiOperation({
    summary: 'Lấy danh sách tư vấn',
    description: 'Lấy tất cả yêu cầu tư vấn từ khách hàng'
  })
  getConsultations() {
    return this.contentService.getConsultations();
  }

  @Put('consultations/:id/status')
  @ApiOperation({
    summary: 'Cập nhật trạng thái tư vấn',
    description: 'Cập nhật trạng thái xử lý yêu cầu tư vấn (PENDING/CONTACTED/DONE)'
  })
  @ApiParam({ name: 'id', description: 'ID của yêu cầu tư vấn' })
  updateConsultationStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.contentService.updateConsultationStatus(id, status);
  }
}
