import { AccountDaoDto } from './account-dao.dto';

export interface AccountDao {
  findByEmail(email: string): Promise<AccountDaoDto | null>;
  save(name: string, email: string, password: string): Promise<string>;
}
