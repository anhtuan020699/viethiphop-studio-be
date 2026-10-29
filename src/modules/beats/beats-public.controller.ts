import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { BeatsService } from './beats.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('beats')
@ApiTags('🎵 Quản lý Beat - Public')
export class BeatsPublicController {
  constructor(private readonly beatsService: BeatsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách beat',
    description: 'Lấy tất cả beat đang có sẵn để mua'
  })
  @ApiQuery({ name: 'genre', required: false, description: 'Lọc theo thể loại (Genre)' })
  @ApiQuery({ name: 'subgenre', required: false, description: 'Lọc theo thể loại phụ' })
  @ApiQuery({ name: 'typeBeat', required: false, description: 'Lọc theo loại beat' })
  findAll(
    @Query('genre') genre?: string,
    @Query('subgenre') subgenre?: string,
    @Query('hiphopDong') hiphopDong?: string,
    @Query('typeBeat') typeBeat?: string,
    @Query('hiphopType') hiphopType?: string,
  ) {
    return this.beatsService.findAll(true, genre, subgenre || hiphopDong, typeBeat || hiphopType);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết beat',
    description: 'Lấy thông tin chi tiết một beat theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của beat' })
  findOne(@Param('id') id: string) {
    return this.beatsService.findOne(id);
  }
}
