import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Public()
  @Get()
  getPublic() {
    return this.aboutService.getPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdmin() {
    return this.aboutService.getAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Post('gallery')
  createGallery(@Body() data: { src: string; caption?: string; order?: number; isActive?: boolean }) {
    return this.aboutService.createGallery(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('gallery/:id')
  updateGallery(
    @Param('id') id: string,
    @Body() data: { src?: string; caption?: string | null; order?: number; isActive?: boolean },
  ) {
    return this.aboutService.updateGallery(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('gallery/:id')
  removeGallery(@Param('id') id: string) {
    return this.aboutService.removeGallery(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  createCategory(@Body() data: { title: string; icon?: string; order?: number; isActive?: boolean }) {
    return this.aboutService.createCategory(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() data: { title?: string; icon?: string; order?: number; isActive?: boolean },
  ) {
    return this.aboutService.updateCategory(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.aboutService.removeCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  createItem(
    @Body()
    data: { categoryId: string; name: string; order?: number; isActive?: boolean; images?: string[] },
  ) {
    return this.aboutService.createItem(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('items/:id')
  updateItem(
    @Param('id') id: string,
    @Body() data: { name?: string; order?: number; isActive?: boolean; images?: string[] },
  ) {
    return this.aboutService.updateItem(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.aboutService.removeItem(id);
  }
}
