import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MixTracksService } from './mix-tracks.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('mix-tracks')
@ApiTags('🎚️ Bản ghi Mix - Public')
export class MixTracksPublicController {
  constructor(private readonly mixTracksService: MixTracksService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách bản ghi mix',
    description: 'Lấy tất cả bản ghi mix đang có sẵn'
  })
  @ApiQuery({ name: 'packageType', required: false, description: 'Lọc theo loại package (Cơ bản/Nâng cao/Chuyên nghiệp)' })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục' })
  @ApiQuery({ name: 'subCategory', required: false, description: 'Lọc theo thể loại con' })
  findAll(
    @Query('packageType') packageType?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.mixTracksService.findAll(true, packageType, category, subCategory);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết bản ghi mix',
    description: 'Lấy thông tin chi tiết một bản ghi mix theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của bản ghi mix' })
  findOne(@Param('id') id: string) {
    return this.mixTracksService.findOne(id);
  }
}
