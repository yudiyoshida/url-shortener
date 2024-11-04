import { Module } from '@nestjs/common';
import { AppCacheModule } from 'src/core/app-cache.module';
import { UrlModule } from '../url/url.module';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';

@Module({
  imports: [UrlModule, AppCacheModule],
  controllers: [RedirectController],
  providers: [RedirectService],
})
export class RedirectModule {}
