import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { hashData, compareData } from '@helpers/utils/hash.util';
import {
  MSG_INVALID_CREDENTIALS,
  MSG_USER_ALREADY_EXISTS,
} from '@helpers/constants/message.constant';
import { JwtPayload } from '@common/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─────────────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException(MSG_USER_ALREADY_EXISTS);

    const hashedPassword = await hashData(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: this.sanitizeUser(user) };
  }

  // ─────────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException(MSG_INVALID_CREDENTIALS);

    const isMatch = await compareData(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException(MSG_INVALID_CREDENTIALS);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: this.sanitizeUser(user) };
  }

  // ─────────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────────
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  // ─────────────────────────────────────────────────
  // Refresh Tokens (Token Rotation)
  // ─────────────────────────────────────────────────
  async refreshTokens(userId: string, rawRefreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isMatch = await compareData(rawRefreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException('Refresh token mismatch');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: this.sanitizeUser(user) };
  }

  // ─────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────
  private async generateTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.accessExpiresIn') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, token: string | null) {
    const hashed = token ? await hashData(token) : null;
    await this.usersService.updateRefreshToken(userId, hashed);
  }

  private sanitizeUser(user: any) {
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
