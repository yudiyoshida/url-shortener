import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infra/database/prisma.module';
import { TOKENS } from 'src/shared/ioc/tokens';
import { FindAccountByEmailUseCase } from './application/usecases/find-account-by-email/find-account-by-email.service';
import { RegisterUseCase } from './application/usecases/register/register.service';
import { AccountController } from './infra/http/account.controller';
import { AccountPrismaAdapterDao } from './infra/persistence/dao/prisma/account-prisma.dao';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    AccountController,
  ],
  providers: [
    RegisterUseCase,
    FindAccountByEmailUseCase,
    {
      provide: TOKENS.AccountDao,
      useClass: AccountPrismaAdapterDao,
    },
  ],
  exports: [
    FindAccountByEmailUseCase,
  ],
})
export class AccountModule {}
