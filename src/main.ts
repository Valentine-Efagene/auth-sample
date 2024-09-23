import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { QueryFailedFilter } from './common/common.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.setGlobalPrefix('developer/api');
  app.enableCors();

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  // Register MySQL exception filter globally
  app.useGlobalFilters(new QueryFailedFilter());

  const config = new DocumentBuilder()
    .setTitle('Sample Auth')
    .setDescription('The API for Sample Auth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(parseInt(process.env.PORT));
}
bootstrap();
