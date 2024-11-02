import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(ConfigService);

  await app.listen(appConfig.get('PORT')!, '0.0.0.0');

  // get app url and save in an environment variable to be used in the shortener url service.
  const url = await app.getUrl();
  appConfig.set('APP_URL', url);
}
bootstrap();
