import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  // --- SETTINGS ---
  async getSettings() {
    return this.prisma.setting.findMany();
  }
  async updateSetting(key: string, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // --- SERVICES ---
  async getServices() {
    return this.prisma.service.findMany({ orderBy: { order: 'asc' } });
  }
  async createService(data: any) {
    return this.prisma.service.create({ data });
  }
  async updateService(id: string, data: any) {
    return this.prisma.service.update({ where: { id }, data });
  }
  async deleteService(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }

  // --- MEDIA ---
  async getMedia() {
    return this.prisma.media.findMany({ orderBy: { order: 'asc' } });
  }
  async createMedia(data: any) {
    return this.prisma.media.create({ data });
  }
  async updateMedia(id: string, data: any) {
    return this.prisma.media.update({ where: { id }, data });
  }
  async deleteMedia(id: string) {
    return this.prisma.media.delete({ where: { id } });
  }

  // --- FAQS ---
  async getFaqs() {
    return this.prisma.faq.findMany({ orderBy: { order: 'asc' } });
  }
  async createFaq(data: any) {
    return this.prisma.faq.create({ data });
  }
  async updateFaq(id: string, data: any) {
    return this.prisma.faq.update({ where: { id }, data });
  }
  async deleteFaq(id: string) {
    return this.prisma.faq.delete({ where: { id } });
  }

  // --- CONSULTATIONS ---
  async getConsultations() {
    return this.prisma.consultation.findMany({ orderBy: { createdAt: 'desc' } });
  }
  async createConsultation(data: any) {
    return this.prisma.consultation.create({ data });
  }
  async updateConsultationStatus(id: string, status: string) {
    return this.prisma.consultation.update({ where: { id }, data: { status } });
  }
}
