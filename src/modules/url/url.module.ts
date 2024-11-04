import { Module } from '@nestjs/common';
import { AppCacheModule } from 'src/core/app-cache.module';
import { AppConfigModule } from 'src/core/app-config.module';
import { PrismaModule } from 'src/shared/infra/database/prisma.module';
import { TOKENS } from 'src/shared/ioc/tokens';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CreateUrlUseCase } from './application/usecases/create-url/create-url.service';
import { DeleteUrlUseCase } from './application/usecases/delete-url/delete-url.service';
import { GetAllUrlsUseCase } from './application/usecases/get-all-urls/get-all-urls.service';
import { GetUrlByIdAndAccountIdUseCase } from './application/usecases/get-url-by-id-and-account-id/get-url-by-id-and-account-id.service';
import { GetUrlUseCase } from './application/usecases/get-url/get-url.service';
import { IncrementClickUseCase } from './application/usecases/increment-click/increment-click.service';
import { UpdateUrlUseCase } from './application/usecases/update-url/update-url.service';
import { UrlController } from './infra/http/url.controller';
import { UrlPrismaAdapterDao } from './infra/persistence/dao/prisma/url-prisma.dao';

@Module({
  imports: [
    AppConfigModule,
    AuthenticationModule,
    AppCacheModule,
    PrismaModule,
  ],
  controllers: [
    UrlController,
  ],
  providers: [
    CreateUrlUseCase,
    GetAllUrlsUseCase,
    GetUrlByIdAndAccountIdUseCase,
    GetUrlUseCase,
    UpdateUrlUseCase,
    DeleteUrlUseCase,
    IncrementClickUseCase,
    {
      provide: TOKENS.UrlDao,
      // useClass: UrlInMemoryAdapterDao,
      useClass: UrlPrismaAdapterDao,
    },
  ],
  exports: [
    GetUrlUseCase,
    IncrementClickUseCase,
  ],
})
export class UrlModule {}
