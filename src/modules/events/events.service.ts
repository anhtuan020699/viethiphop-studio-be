import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  private async assertSlugFree(slug: string, excludeId?: string) {
    const existing = await this.prisma.event.findUnique({ where: { slug } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Slug đã tồn tại, hãy chọn đường dẫn khác');
    }
  }

  async create(data: any) {
    const slug = data.slug
      ? generateSlug(data.slug)
      : generateSlug(data.title || 'tin-tuc');

    await this.assertSlugFree(slug);

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
      await this.assertSlugFree(data.slug, id);
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
