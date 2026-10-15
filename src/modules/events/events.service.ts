import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = false, category?: string, search?: string) {
    const where: any = activeOnly ? { isActive: true } : {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.event.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findBySlugOrId(slugOrId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
    });

    if (!event) {
      throw new NotFoundException('Không tìm thấy bài viết / sự kiện');
    }

    return event;
  }

  async create(data: any) {
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || 'tin-tuc');
    
    // Ensure slug uniqueness
    let existing = await this.prisma.event.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    delete data.date;
    delete data.location;
    return this.prisma.event.create({
      data: {
        ...data,
        slug,
        author: "Việt Hiphop Studio",
      },
    });
  }

  async update(id: string, data: any) {
    delete data.date;
    delete data.location;
    data.author = "Việt Hiphop Studio";
    if (data.slug) {
      data.slug = generateSlug(data.slug);
    }
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
