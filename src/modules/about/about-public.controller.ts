import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('about')
@ApiTags('ℹ️ Trang "Về chúng tôi" - Public')
export class AboutPublicController {
  constructor(private readonly aboutService: AboutService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy thông tin Về chúng tôi',
    description: 'Lấy thông tin công khai của trang About'
  })
  getPublic() {
    return this.aboutService.getPublic();
  }
}
