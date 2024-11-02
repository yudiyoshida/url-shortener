import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener REST API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, { autoTagControllers: false });
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(appConfig.get('PORT')!, '0.0.0.0');

  // get app url and save in an environment variable to be used in the shortener url service.
  const url = await app.getUrl();
  appConfig.set('APP_URL', url);
}
bootstrap();
