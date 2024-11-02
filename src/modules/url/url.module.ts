import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/core/app-config.module';
import { TOKENS } from 'src/shared/ioc/tokens';
import { CreateUrlUseCase } from './application/usecases/create-url/create-url.service';
import { GetAllUrlsUseCase } from './application/usecases/get-all-urls/get-all-urls.service';
import { UrlController } from './infra/http/url.controller';
import { UrlInMemoryAdapterDao } from './infra/persistence/dao/in-memory/url-in-memory.dao';

@Module({
  imports: [
    AppConfigModule,
  ],
  controllers: [
    UrlController,
  ],
  providers: [
    CreateUrlUseCase,
    GetAllUrlsUseCase,
    {
      provide: TOKENS.UrlDao,
      useClass: UrlInMemoryAdapterDao,
    },
  ],
})
export class UrlModule {}
