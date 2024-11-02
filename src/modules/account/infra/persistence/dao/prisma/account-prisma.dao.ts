import { Injectable } from '@nestjs/common';
import { AccountDaoDto } from 'src/modules/account/application/persistence/dao/account-dao.dto';
import { AccountDao } from 'src/modules/account/application/persistence/dao/account-dao.interface';
import { PrismaService } from 'src/shared/infra/database/prisma.service';

@Injectable()
export class AccountPrismaAdapterDao implements AccountDao {
  constructor(private readonly prisma: PrismaService) {}

  public async findByEmail(email: string): Promise<AccountDaoDto | null> {
    return this.prisma.account.findUnique({
      where: { email },
    });
  }

  public async save(name: string, email: string, password: string): Promise<string> {
    const account = await this.prisma.account.create({
      data: {
        name,
        email,
        password,
      },
    });

    return account.id;
  }
}
