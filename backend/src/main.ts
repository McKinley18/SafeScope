import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { StandardsSeedService } from './standards/standards-seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  
  const configService = app.get(ConfigService);

  try {
    const seedService = app.get(StandardsSeedService);
    const result = await seedService.seedDefaults();
    console.log('Standards seed check completed:', result);
  } catch (error) {
    console.error('Standards seed check failed:', error);
  }

  const port = configService.get<number>('PORT') || 3000;
  
  await app.listen(port);
}
bootstrap();
