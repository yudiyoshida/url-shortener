import { Module } from '@nestjs/common';
import { AppConfigModule } from './core/app-config.module';
import { AccountModule } from './modules/account/account.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [
    AppConfigModule,
    AccountModule,
    AuthenticationModule,
    UrlModule,
    HealthCheckModule,
  ],
})
export class AppModule {}
