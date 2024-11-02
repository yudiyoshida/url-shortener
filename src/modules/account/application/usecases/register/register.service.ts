import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Password } from 'src/modules/account/domain/value-objects/password.vo';
import { Errors } from 'src/shared/errors/messages';
import { TOKENS } from 'src/shared/ioc/tokens';
import { AccountDao } from '../../persistence/dao/account-dao.interface';
import { RegisterInputDto, RegisterOutputDto } from './dtos/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(TOKENS.AccountDao) private readonly accountDao: AccountDao,
  ) {}

  public async execute(data: RegisterInputDto): Promise<RegisterOutputDto> {
    const emailExists = await this.accountDao.findByEmail(data.email);
    if (emailExists) {
      throw new ConflictException(Errors.EMAIL_ALREADY_EXISTS);
    }

    const password = new Password(data.password);
    const accountId = await this.accountDao.save(data.name, data.email, password.value);

    return { id: accountId };
  }
}
