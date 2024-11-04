import { Module } from '@nestjs/common';
import { AppCacheModule } from './core/app-cache.module';
import { AppConfigModule } from './core/app-config.module';
import { AppRouterModule } from './core/app-router.module';
import { AccountModule } from './modules/account/account.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { RedirectModule } from './modules/redirect/redirect.module';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [
    AppConfigModule,
    AppCacheModule,
    AppRouterModule,
    AccountModule,
    AuthenticationModule,
    UrlModule,
    HealthCheckModule,
    RedirectModule,
  ],
})
export class AppModule {}
