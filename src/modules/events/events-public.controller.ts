import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('events')
@ApiTags('📰 Sự kiện & Tin tức - Public')
export class EventsPublicController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách sự kiện',
    description: 'Lấy tất cả sự kiện/tin tức đang công bố'
  })
  @ApiQuery({ name: 'category', required: false, description: 'Lọc theo danh mục (Sự kiện/Tin tức/Workshop)' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm theo tên hoặc nội dung' })
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll(true, category, search);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({
    summary: 'Lấy chi tiết sự kiện',
    description: 'Lấy thông tin chi tiết một sự kiện theo slug hoặc ID'
  })
  @ApiParam({ name: 'slug', description: 'Slug hoặc ID của sự kiện' })
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findBySlugOrId(slug);
  }
}
