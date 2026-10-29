import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('content')
@ApiTags('📝 Quản lý nội dung')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // --- SETTINGS ---
  @Public()
  @Get('settings')
  @ApiOperation({ summary: 'Lấy cài đặt chung', description: 'Lấy danh sách các cài đặt chung của website' })
  getSettings() {
    return this.contentService.getSettings();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Cập nhật cài đặt', description: 'Cập nhật giá trị một cài đặt theo key' })
  updateSetting(@Body() data: { key: string; value: string }) {
    return this.contentService.updateSetting(data.key, data.value);
  }

  // --- SERVICES ---
  @Public()
  @Get('services')
  @ApiOperation({ summary: 'Lấy danh sách dịch vụ', description: 'Lấy tất cả dịch vụ đang hoạt động' })
  getServices() {
    return this.contentService.getServices();
  }

  @Post('services')
  @ApiOperation({ summary: 'Tạo dịch vụ mới', description: 'Tạo một dịch vụ mới trong hệ thống' })
  createService(@Body() data: any) {
    return this.contentService.createService(data);
  }

  @Put('services/:id')
  @ApiOperation({ summary: 'Cập nhật dịch vụ', description: 'Cập nhật thông tin dịch vụ theo ID' })
  @ApiParam({ name: 'id', description: 'ID của dịch vụ' })
  updateService(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateService(id, data);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Xóa dịch vụ', description: 'Xóa một dịch vụ khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của dịch vụ' })
  deleteService(@Param('id') id: string) {
    return this.contentService.deleteService(id);
  }

  // --- MEDIA ---
  @Public()
  @Get('media')
  @ApiOperation({ summary: 'Lấy danh sách media', description: 'Lấy tất cả hình ảnh/media đang hoạt động' })
  getMedia() {
    return this.contentService.getMedia();
  }

  @Post('media')
  @ApiOperation({ summary: 'Tạo media mới', description: 'Thêm một hình ảnh hoặc media mới' })
  createMedia(@Body() data: any) {
    return this.contentService.createMedia(data);
  }

  @Put('media/:id')
  @ApiOperation({ summary: 'Cập nhật media', description: 'Cập nhật thông tin hình ảnh/media theo ID' })
  @ApiParam({ name: 'id', description: 'ID của media' })
  updateMedia(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateMedia(id, data);
  }

  @Delete('media/:id')
  @ApiOperation({ summary: 'Xóa media', description: 'Xóa một hình ảnh hoặc media khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của media' })
  deleteMedia(@Param('id') id: string) {
    return this.contentService.deleteMedia(id);
  }

  // --- FAQS ---
  @Public()
  @Get('faqs')
  @ApiOperation({ summary: 'Lấy danh sách FAQ', description: 'Lấy tất cả câu hỏi thường gặp đang hoạt động' })
  getFaqs() {
    return this.contentService.getFaqs();
  }

  @Post('faqs')
  @ApiOperation({ summary: 'Tạo FAQ mới', description: 'Thêm một câu hỏi thường gặp mới vào hệ thống' })
  createFaq(@Body() data: any) {
    return this.contentService.createFaq(data);
  }

  @Put('faqs/:id')
  @ApiOperation({ summary: 'Cập nhật FAQ', description: 'Cập nhật nội dung câu hỏi hoặc câu trả lời theo ID' })
  @ApiParam({ name: 'id', description: 'ID của FAQ' })
  updateFaq(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateFaq(id, data);
  }

  @Delete('faqs/:id')
  @ApiOperation({ summary: 'Xóa FAQ', description: 'Xóa một câu hỏi thường gặp khỏi hệ thống' })
  @ApiParam({ name: 'id', description: 'ID của FAQ' })
  deleteFaq(@Param('id') id: string) {
    return this.contentService.deleteFaq(id);
  }

  // --- CONSULTATIONS ---
  @Get('consultations')
  @ApiOperation({ summary: 'Lấy danh sách tư vấn', description: 'Lấy tất cả yêu cầu tư vấn từ khách hàng' })
  getConsultations() {
    return this.contentService.getConsultations();
  }

  @Public()
  @Post('consultations')
  @ApiOperation({ summary: 'Tạo yêu cầu tư vấn', description: 'Khách hàng gửi yêu cầu tư vấn dịch vụ' })
  createConsultation(@Body() data: any) {
    return this.contentService.createConsultation(data);
  }

  @Put('consultations/:id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái tư vấn', description: 'Cập nhật trạng thái xử lý yêu cầu tư vấn (PENDING/CONTACTED/DONE)' })
  @ApiParam({ name: 'id', description: 'ID của yêu cầu tư vấn' })
  updateConsultationStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.contentService.updateConsultationStatus(id, status);
  }
}
