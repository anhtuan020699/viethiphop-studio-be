import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // ─── Security ───────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ───────────────────────────────────────────────────────
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3001').split(',');
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ─── API Prefix ─────────────────────────────────────────────────
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // ─── Global Validation Pipe ─────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strip unknown fields
      forbidNonWhitelisted: true,   // throw on unknown fields
      transform: true,              // auto-transform DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── Swagger ────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Core BE API')
    .setDescription('Enterprise NestJS Backend Base')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ─── Start ──────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/${apiPrefix}/docs\n`);
}

bootstrap();
