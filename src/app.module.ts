import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';

import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { ContentModule } from './modules/content/content.module';
import r2Config from './config/r2.config';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    // ─── Config (load env namespaces) ───────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig, r2Config],
      envFilePath: '.env',
    }),

    // ─── Rate Limiting ───────────────────────────────────────────
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
            limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
          },
        ],
      }),
    }),

    // ─── Database ────────────────────────────────────────────────
    PrismaModule,

    // ─── Feature Modules ─────────────────────────────────────────
    UsersModule,
    AuthModule,
    UploadModule,
    ContentModule,
  ],

  providers: [
    // Global Exception Filter
    { provide: APP_FILTER, useClass: HttpExceptionFilter },

    // Global Response Transform Interceptor
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

    // Global JWT Auth Guard (use @Public() to bypass)
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
