import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './core/app-config.module';
import { AccountModule } from './modules/account/account.module';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [
    AppConfigModule,
    AccountModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
