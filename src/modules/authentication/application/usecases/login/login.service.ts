import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindAccountByEmailUseCase } from 'src/modules/account/application/usecases/find-account-by-email/find-account-by-email.service';
import { Password } from 'src/modules/account/domain/value-objects/password.vo';
import { Errors } from 'src/shared/errors/messages';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly findAccountByEmail: FindAccountByEmailUseCase,
  ) {}

  public async execute(data: LoginInputDto): Promise<LoginOutputDto> {
    const account = await this.findAccountByEmail.execute(data.email);
    if (!account) {
      throw new BadRequestException(Errors.INVALID_CREDENTIALS);
    }

    const passwordMatch = Password.compare(data.password, account.password);
    if (!passwordMatch) {
      throw new BadRequestException(Errors.INVALID_CREDENTIALS);
    }

    const token = this.jwtService.sign({ id: account.id });

    return { token };
  }
}
