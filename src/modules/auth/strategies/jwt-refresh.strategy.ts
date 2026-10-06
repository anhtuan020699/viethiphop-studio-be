import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '@common/types/jwt-payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret') ?? '',
      passReqToCallback: true as const,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const authHeader = req.get('Authorization');
    const refreshToken = authHeader?.replace('Bearer ', '').trim();
    return { ...payload, refreshToken };
  }
}
