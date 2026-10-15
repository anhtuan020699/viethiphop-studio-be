import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

const galleryOrder = { orderBy: [{ order: 'asc' as const }, { createdAt: 'asc' as const }] };
const itemInclude = {
  images: { orderBy: { order: 'asc' as const } },
};
const categoryInclude = {
  items: {
    orderBy: [{ order: 'asc' as const }, { createdAt: 'asc' as const }],
    include: itemInclude,
  },
};

@Injectable()
export class AboutService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublic() {
    const [gallery, categories] = await Promise.all([
      this.prisma.aboutGalleryImage.findMany({
        where: { isActive: true },
        ...galleryOrder,
      }),
      this.prisma.gearCategory.findMany({
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        include: {
          items: {
            where: { isActive: true },
            orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
            include: itemInclude,
          },
        },
      }),
    ]);
    return { gallery, categories };
  }

  async getAdmin() {
    const [gallery, categories] = await Promise.all([
      this.prisma.aboutGalleryImage.findMany(galleryOrder),
      this.prisma.gearCategory.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        include: categoryInclude,
      }),
    ]);
    return { gallery, categories };
  }

  createGallery(data: { src: string; caption?: string; order?: number; isActive?: boolean }) {
    return this.prisma.aboutGalleryImage.create({
      data: {
        src: data.src,
        caption: data.caption || null,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateGallery(
    id: string,
    data: { src?: string; caption?: string | null; order?: number; isActive?: boolean },
  ) {
    await this.ensureGallery(id);
    return this.prisma.aboutGalleryImage.update({ where: { id }, data });
  }

  async removeGallery(id: string) {
    await this.ensureGallery(id);
    return this.prisma.aboutGalleryImage.delete({ where: { id } });
  }

  createCategory(data: { title: string; icon?: string; order?: number; isActive?: boolean }) {
    return this.prisma.gearCategory.create({
      data: {
        title: data.title,
        icon: data.icon || 'Mic2',
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
      include: categoryInclude,
    });
  }

  async updateCategory(
    id: string,
    data: { title?: string; icon?: string; order?: number; isActive?: boolean },
  ) {
    await this.ensureCategory(id);
    return this.prisma.gearCategory.update({
      where: { id },
      data,
      include: categoryInclude,
    });
  }

  async removeCategory(id: string) {
    await this.ensureCategory(id);
    return this.prisma.gearCategory.delete({ where: { id } });
  }

  async createItem(data: {
    categoryId: string;
    name: string;
    order?: number;
    isActive?: boolean;
    images?: string[];
  }) {
    await this.ensureCategory(data.categoryId);
    const images = (data.images || []).filter(Boolean);
    return this.prisma.gearItem.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
        images: {
          create: images.map((src, index) => ({ src, order: index })),
        },
      },
      include: itemInclude,
    });
  }

  async updateItem(
    id: string,
    data: {
      name?: string;
      order?: number;
      isActive?: boolean;
      images?: string[];
    },
  ) {
    await this.ensureItem(id);
    return this.prisma.$transaction(async (tx) => {
      if (Array.isArray(data.images)) {
        await tx.gearItemImage.deleteMany({ where: { itemId: id } });
        if (data.images.length) {
          await tx.gearItemImage.createMany({
            data: data.images.filter(Boolean).map((src, index) => ({
              itemId: id,
              src,
              order: index,
            })),
          });
        }
      }
      return tx.gearItem.update({
        where: { id },
        data: {
          name: data.name,
          order: data.order,
          isActive: data.isActive,
        },
        include: itemInclude,
      });
    });
  }

  async removeItem(id: string) {
    await this.ensureItem(id);
    return this.prisma.gearItem.delete({ where: { id } });
  }

  private async ensureGallery(id: string) {
    const row = await this.prisma.aboutGalleryImage.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy ảnh studio');
  }

  private async ensureCategory(id: string) {
    const row = await this.prisma.gearCategory.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy nhóm thiết bị');
  }

  private async ensureItem(id: string) {
    const row = await this.prisma.gearItem.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy thiết bị');
  }
}
