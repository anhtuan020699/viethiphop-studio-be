import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('👤 Quản lý Người dùng')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản', description: 'Lấy thông tin profile của người dùng hiện tại' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findMe(userId);
  }
}
