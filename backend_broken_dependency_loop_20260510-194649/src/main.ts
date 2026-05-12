import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 🔷 SECURITY HEADERS
  app.use(helmet());

  // 🔷 GLOBAL VALIDATION
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 🔷 CORS: Dynamic origin based on environment
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const PORT = configService.get<number>('PORT') || 3001; 

  await app.listen(PORT);

  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${configService.get<string>('NODE_ENV')}`);
}
bootstrap();
