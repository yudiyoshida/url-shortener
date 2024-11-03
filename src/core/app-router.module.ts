
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AccountModule } from 'src/modules/account/account.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { HealthCheckModule } from 'src/modules/health-check/health-check.module';
import { RedirectModule } from 'src/modules/redirect/redirect.module';
import { UrlModule } from 'src/modules/url/url.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'v1',
        children: [
          { path: 'urls', module: UrlModule },
          { path: 'accounts', module: AccountModule },
          { path: 'auth', module: AuthenticationModule },
        ],
      },
      {
        path: 'health-check',
        module: HealthCheckModule,
      },
      {
        path: ':shortUrl',
        module: RedirectModule,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRouterModule {}
