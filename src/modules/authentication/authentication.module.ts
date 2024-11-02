import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { LoginUseCase } from './application/usecases/login/login.service';
import { AuthenticationController } from './infra/http/authentication.controller';
import { JwtAuthModule } from './jwt.module';

@Module({
  imports: [
    JwtAuthModule,
    AccountModule,
  ],
  controllers: [
    AuthenticationController,
  ],
  providers: [
    LoginUseCase,
  ],
})
export class AuthenticationModule {}
