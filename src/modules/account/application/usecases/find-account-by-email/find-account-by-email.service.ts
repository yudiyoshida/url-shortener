import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/shared/ioc/tokens';
import { AccountDaoDto } from '../../persistence/dao/account-dao.dto';
import { AccountDao } from '../../persistence/dao/account-dao.interface';

@Injectable()
export class FindAccountByEmailUseCase {
  constructor(
    @Inject(TOKENS.AccountDao) private accountDao: AccountDao,
  ) {}

  public async execute(email: string): Promise<AccountDaoDto|null> {
    return this.accountDao.findByEmail(email);
  }
}
