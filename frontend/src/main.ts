import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StandardsService } from './standards/standards.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  });

  const standardsService = app.get(StandardsService);
  await standardsService.seedInitial();

  await app.listen(4000);
  console.log('🚀 http://localhost:4000');
}

bootstrap();
