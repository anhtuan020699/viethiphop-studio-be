import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Get()
  findPublic(@Query('year') year?: string) {
    return this.customersService.findPublic(year ? Number(year) : 2026);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAdmin(@Query('year') year?: string) {
    return this.customersService.findAdmin(year ? Number(year) : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rankings')
  createRanking(@Body() data: any) {
    return this.customersService.createRanking(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('rankings/:id')
  updateRanking(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateRanking(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('rankings/:id')
  removeRanking(@Param('id') id: string) {
    return this.customersService.removeRanking(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('highlights')
  createHighlight(@Body() data: any) {
    return this.customersService.createHighlight(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('highlights/:id')
  updateHighlight(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateHighlight(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('highlights/:id')
  removeHighlight(@Param('id') id: string) {
    return this.customersService.removeHighlight(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('clips')
  createClip(@Body() data: any) {
    return this.customersService.createClip(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('clips/:id')
  updateClip(@Param('id') id: string, @Body() data: any) {
    return this.customersService.updateClip(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('clips/:id')
  removeClip(@Param('id') id: string) {
    return this.customersService.removeClip(id);
  }
}
