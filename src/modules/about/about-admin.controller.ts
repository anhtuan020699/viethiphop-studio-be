import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../helpers/enums/role.enum';

@Controller('admin/about')
@ApiTags('ℹ️ Trang "Về chúng tôi" - Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AboutAdminController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy thông tin Về chúng tôi (Admin)',
    description: 'Lấy tất cả dữ liệu của trang About kể cả những cái chưa công bố'
  })
  getAdmin() {
    return this.aboutService.getAdmin();
  }

  // --- GALLERY ---
  @Post('gallery')
  @ApiOperation({
    summary: 'Thêm ảnh vào Thư viện',
    description: 'Thêm một ảnh mới vào thư viện ảnh của trang About'
  })
  createGallery(@Body() data: { src: string; caption?: string; order?: number; isActive?: boolean }) {
    return this.aboutService.createGallery(data);
  }

  @Put('gallery/:id')
  @ApiOperation({
    summary: 'Cập nhật ảnh trong Thư viện',
    description: 'Cập nhật thông tin hoặc link ảnh'
  })
  @ApiParam({ name: 'id', description: 'ID của ảnh' })
  updateGallery(
    @Param('id') id: string,
    @Body() data: { src?: string; caption?: string | null; order?: number; isActive?: boolean },
  ) {
    return this.aboutService.updateGallery(id, data);
  }

  @Delete('gallery/:id')
  @ApiOperation({
    summary: 'Xóa ảnh khỏi Thư viện',
    description: 'Xóa một ảnh khỏi thư viện'
  })
  @ApiParam({ name: 'id', description: 'ID của ảnh' })
  removeGallery(@Param('id') id: string) {
    return this.aboutService.removeGallery(id);
  }

  // --- CATEGORIES ---
  @Post('categories')
  @ApiOperation({
    summary: 'Tạo danh mục thiết bị',
    description: 'Tạo một danh mục mới cho các thiết bị (VD: Microphone, Interface, ...)'
  })
  createCategory(@Body() data: { title: string; icon?: string; order?: number; isActive?: boolean }) {
    return this.aboutService.createCategory(data);
  }

  @Put('categories/:id')
  @ApiOperation({
    summary: 'Cập nhật danh mục thiết bị',
    description: 'Cập nhật tên hoặc icon của danh mục'
  })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  updateCategory(
    @Param('id') id: string,
    @Body() data: { title?: string; icon?: string; order?: number; isActive?: boolean },
  ) {
    return this.aboutService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  @ApiOperation({
    summary: 'Xóa danh mục thiết bị',
    description: 'Xóa một danh mục (cũng xóa tất cả thiết bị trong danh mục)'
  })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  removeCategory(@Param('id') id: string) {
    return this.aboutService.removeCategory(id);
  }

  // --- ITEMS ---
  @Post('items')
  @ApiOperation({
    summary: 'Thêm thiết bị mới',
    description: 'Thêm một thiết bị mới vào danh mục'
  })
  createItem(
    @Body()
    data: { categoryId: string; name: string; order?: number; isActive?: boolean; images?: string[] },
  ) {
    return this.aboutService.createItem(data);
  }

  @Put('items/:id')
  @ApiOperation({
    summary: 'Cập nhật thông tin thiết bị',
    description: 'Cập nhật tên, ảnh hoặc thứ tự hiển thị của thiết bị'
  })
  @ApiParam({ name: 'id', description: 'ID của thiết bị' })
  updateItem(
    @Param('id') id: string,
    @Body() data: { name?: string; order?: number; isActive?: boolean; images?: string[] },
  ) {
    return this.aboutService.updateItem(id, data);
  }

  @Delete('items/:id')
  @ApiOperation({
    summary: 'Xóa thiết bị',
    description: 'Xóa một thiết bị khỏi danh mục'
  })
  @ApiParam({ name: 'id', description: 'ID của thiết bị' })
  removeItem(@Param('id') id: string) {
    return this.aboutService.removeItem(id);
  }
}
