import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MixTracksService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = false, packageType?: string, category?: string, subCategory?: string) {
    const where: any = activeOnly ? { isActive: true } : {};
    if (packageType && packageType !== 'all') where.packageType = packageType;
    if (category && category !== 'all') where.category = category;
    if (subCategory && subCategory !== 'all') where.subCategory = subCategory;
    return this.prisma.mixTrack.findMany({ where, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  }

  async findOne(id: string) {
    const item = await this.prisma.mixTrack.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Không tìm thấy bản thu');
    return item;
  }

  async create(data: any) {
    return this.prisma.mixTrack.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.mixTrack.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.mixTrack.delete({ where: { id } });
  }
}
