import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('customers')
@ApiTags('🏆 Khách hàng & Bảng xếp hạng - Public')
export class CustomersPublicController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy thông tin khách hàng',
    description: 'Lấy bảng xếp hạng, highlight và clips của năm'
  })
  @ApiQuery({ name: 'year', required: false, description: 'Năm cần lấy dữ liệu (mặc định 2026)' })
  findPublic(@Query('year') year?: string) {
    return this.customersService.findPublic(year ? Number(year) : 2026);
  }
}
