import { Module } from '@nestjs/common';
import { UrlModule } from '../url/url.module';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';

@Module({
  imports: [UrlModule],
  controllers: [RedirectController],
  providers: [RedirectService],
})
export class RedirectModule {}
