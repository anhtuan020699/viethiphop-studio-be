import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

function clean(value: unknown) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text || null;
}

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findPublic(year = 2026) {
    const [rankings, highlights, clips] = await Promise.all([
      this.prisma.customerRanking.findMany({
        where: { year, isActive: true },
        orderBy: { rank: 'asc' },
      }),
      this.prisma.customerHighlight.findMany({
        where: { year, isActive: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      }),
      this.prisma.customerClip.findMany({
        where: { isActive: true },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      }),
    ]);
    return { year, rankings, highlights, clips };
  }

  async findAdmin(year?: number) {
    const yearWhere = year ? { year } : {};
    const [rankings, highlights, clips] = await Promise.all([
      this.prisma.customerRanking.findMany({
        where: yearWhere,
        orderBy: [{ year: 'desc' }, { rank: 'asc' }],
      }),
      this.prisma.customerHighlight.findMany({
        where: yearWhere,
        orderBy: [{ year: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
      }),
      this.prisma.customerClip.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);
    return { rankings, highlights, clips };
  }

  async createRanking(data: any) {
    return this.prisma.customerRanking.create({ data: this.rankingData(data) });
  }

  async updateRanking(id: string, data: any) {
    await this.ensureRanking(id);
    return this.prisma.customerRanking.update({ where: { id }, data: this.rankingData(data) });
  }

  async removeRanking(id: string) {
    await this.ensureRanking(id);
    return this.prisma.customerRanking.delete({ where: { id } });
  }

  async createHighlight(data: any) {
    return this.prisma.customerHighlight.create({ data: this.highlightData(data) });
  }

  async updateHighlight(id: string, data: any) {
    await this.ensureHighlight(id);
    return this.prisma.customerHighlight.update({ where: { id }, data: this.highlightData(data) });
  }

  async removeHighlight(id: string) {
    await this.ensureHighlight(id);
    return this.prisma.customerHighlight.delete({ where: { id } });
  }

  async createClip(data: any) {
    return this.prisma.customerClip.create({ data: this.clipData(data) });
  }

  async updateClip(id: string, data: any) {
    await this.ensureClip(id);
    return this.prisma.customerClip.update({ where: { id }, data: this.clipData(data) });
  }

  async removeClip(id: string) {
    await this.ensureClip(id);
    return this.prisma.customerClip.delete({ where: { id } });
  }

  private rankingData(data: any) {
    return {
      year: Number(data.year) || 2026,
      rank: Number(data.rank) || 1,
      name: String(data.name || '').trim(),
      stageName: clean(data.stageName),
      recordingCount: Math.max(0, Number(data.recordingCount) || 0),
      beatCount: Math.max(0, Number(data.beatCount) || 0),
      note: clean(data.note),
      avatar: clean(data.avatar),
      isActive: data.isActive !== false,
    };
  }

  private highlightData(data: any) {
    return {
      year: Number(data.year) || 2026,
      month: 0,
      name: clean(data.name),
      caption: clean(data.caption),
      image: String(data.image || '').trim(),
      order: Number(data.order) || 0,
      isActive: data.isActive !== false,
    };
  }

  private clipData(data: any) {
    const category = ['feedback', 'livesession', 'recording', 'compare'].includes(data.category)
      ? data.category
      : 'feedback';
    return {
      category,
      title: String(data.title || '').trim(),
      customerName: clean(data.customerName),
      youtubeUrl: String(data.youtubeUrl || '').trim(),
      thumbUrl: clean(data.thumbUrl),
      order: Number(data.order) || 0,
      isActive: data.isActive !== false,
    };
  }

  private async ensureRanking(id: string) {
    const row = await this.prisma.customerRanking.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy hạng khách hàng');
  }

  private async ensureHighlight(id: string) {
    const row = await this.prisma.customerHighlight.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy ảnh khách hàng');
  }

  private async ensureClip(id: string) {
    const row = await this.prisma.customerClip.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy clip');
  }
}
