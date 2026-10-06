import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BeatsService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = false) {
    const where = activeOnly ? { isActive: true } : {};
    return this.prisma.beat.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const beat = await this.prisma.beat.findUnique({ where: { id } });
    if (!beat) throw new NotFoundException('Không tìm thấy Beat');
    return beat;
  }

  async create(data: any) {
    return this.prisma.beat.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.beat.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.beat.delete({ where: { id } });
  }
}
