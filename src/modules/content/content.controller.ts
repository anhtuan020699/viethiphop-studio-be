import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ContentService } from './content.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // --- SETTINGS ---
  @Public()
  @Get('settings')
  getSettings() {
    return this.contentService.getSettings();
  }
  @Put('settings')
  updateSetting(@Body() data: { key: string; value: string }) {
    return this.contentService.updateSetting(data.key, data.value);
  }

  // --- SERVICES ---
  @Public()
  @Get('services')
  getServices() {
    return this.contentService.getServices();
  }
  @Post('services')
  createService(@Body() data: any) {
    return this.contentService.createService(data);
  }
  @Put('services/:id')
  updateService(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateService(id, data);
  }
  @Delete('services/:id')
  deleteService(@Param('id') id: string) {
    return this.contentService.deleteService(id);
  }

  // --- MEDIA ---
  @Public()
  @Get('media')
  getMedia() {
    return this.contentService.getMedia();
  }
  @Post('media')
  createMedia(@Body() data: any) {
    return this.contentService.createMedia(data);
  }
  @Put('media/:id')
  updateMedia(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateMedia(id, data);
  }
  @Delete('media/:id')
  deleteMedia(@Param('id') id: string) {
    return this.contentService.deleteMedia(id);
  }

  // --- FAQS ---
  @Public()
  @Get('faqs')
  getFaqs() {
    return this.contentService.getFaqs();
  }
  @Post('faqs')
  createFaq(@Body() data: any) {
    return this.contentService.createFaq(data);
  }
  @Put('faqs/:id')
  updateFaq(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateFaq(id, data);
  }
  @Delete('faqs/:id')
  deleteFaq(@Param('id') id: string) {
    return this.contentService.deleteFaq(id);
  }

  // --- CONSULTATIONS ---
  @Get('consultations')
  getConsultations() {
    return this.contentService.getConsultations();
  }
  @Public()
  @Post('consultations')
  createConsultation(@Body() data: any) {
    return this.contentService.createConsultation(data);
  }
  @Put('consultations/:id/status')
  updateConsultationStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.contentService.updateConsultationStatus(id, status);
  }
}
