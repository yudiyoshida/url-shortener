import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/core/app-config.module';
import { PrismaModule } from 'src/shared/infra/database/prisma.module';
import { TOKENS } from 'src/shared/ioc/tokens';
import { CreateUrlUseCase } from './application/usecases/create-url/create-url.service';
import { GetAllUrlsUseCase } from './application/usecases/get-all-urls/get-all-urls.service';
import { UrlController } from './infra/http/url.controller';
import { UrlPrismaAdapterDao } from './infra/persistence/dao/prisma/url-prisma.dao';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
  ],
  controllers: [
    UrlController,
  ],
  providers: [
    CreateUrlUseCase,
    GetAllUrlsUseCase,
    {
      provide: TOKENS.UrlDao,
      // useClass: UrlInMemoryAdapterDao,
      useClass: UrlPrismaAdapterDao,
    },
  ],
})
export class UrlModule {}
