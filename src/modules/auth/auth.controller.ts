import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, TokensResponseDto } from './dto/auth-response.dto';
import { JwtRefreshGuard } from '@common/guards/jwt-refresh.guard';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';
import {
  ApiSuccessResponse,
  ApiCreatedSuccessResponse,
  ApiBadRequest,
  ApiUnauthorized,
  ApiTooManyRequests,
  ApiAuthErrors,
} from '@common/decorators/swagger.decorator';
import {
  MSG_LOGIN_SUCCESS,
  MSG_LOGOUT_SUCCESS,
  MSG_REFRESH_SUCCESS,
  MSG_REGISTER_SUCCESS,
} from '@helpers/constants/message.constant';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─────────────────────────────────────────────────
  // POST /auth/register
  // ─────────────────────────────────────────────────
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new account' })
  @ApiCreatedSuccessResponse(AuthResponseDto, 'Registration successful')
  @ApiBadRequest('Email already exists or validation failed')
  @ApiTooManyRequests()
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return { message: MSG_REGISTER_SUCCESS, ...data };
  }

  // ─────────────────────────────────────────────────
  // POST /auth/login
  // ─────────────────────────────────────────────────
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiSuccessResponse(AuthResponseDto, 'Login successful')
  @ApiUnauthorized('Invalid email or password')
  @ApiTooManyRequests()
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return { message: MSG_LOGIN_SUCCESS, ...data };
  }

  // ─────────────────────────────────────────────────
  // POST /auth/logout
  // ─────────────────────────────────────────────────
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (invalidate refresh token)' })
  @ApiSuccessResponse(AuthResponseDto, 'Logged out successfully')
  @ApiAuthErrors()
  async logout(@CurrentUser('id') userId: string) {
    await this.authService.logout(userId);
    return { message: MSG_LOGOUT_SUCCESS };
  }

  // ─────────────────────────────────────────────────
  // POST /auth/refresh
  // ─────────────────────────────────────────────────
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token (token rotation)' })
  @ApiSuccessResponse(TokensResponseDto, 'New tokens issued')
  @ApiUnauthorized('Refresh token invalid or expired')
  async refresh(@CurrentUser() user: any) {
    const data = await this.authService.refreshTokens(user.sub, user.refreshToken);
    return { message: MSG_REFRESH_SUCCESS, ...data };
  }
}
