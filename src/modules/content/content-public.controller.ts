import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('content')
@ApiTags('📝 Quản lý nội dung - Public')
export class ContentPublicController {
  constructor(private readonly contentService: ContentService) {}

  // --- SETTINGS (Public Read) ---
  @Public()
  @Get('settings')
  @ApiOperation({
    summary: 'Lấy cài đặt chung',
    description: 'Lấy danh sách các cài đặt chung của website'
  })
  getSettings() {
    return this.contentService.getSettings();
  }

  // --- SERVICES (Public Read) ---
  @Public()
  @Get('services')
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ',
    description: 'Lấy tất cả dịch vụ đang hoạt động'
  })
  getServices() {
    return this.contentService.getServices();
  }

  // --- MEDIA (Public Read) ---
  @Public()
  @Get('media')
  @ApiOperation({
    summary: 'Lấy danh sách media',
    description: 'Lấy tất cả hình ảnh/media đang hoạt động'
  })
  getMedia() {
    return this.contentService.getMedia();
  }

  // --- FAQS (Public Read) ---
  @Public()
  @Get('faqs')
  @ApiOperation({
    summary: 'Lấy danh sách FAQ',
    description: 'Lấy tất cả câu hỏi thường gặp đang hoạt động'
  })
  getFaqs() {
    return this.contentService.getFaqs();
  }

  // --- CONSULTATIONS (Public Create) ---
  @Public()
  @Post('consultations')
  @ApiOperation({
    summary: 'Tạo yêu cầu tư vấn',
    description: 'Khách hàng gửi yêu cầu tư vấn dịch vụ'
  })
  createConsultation(@Body() data: any) {
    return this.contentService.createConsultation(data);
  }
}
