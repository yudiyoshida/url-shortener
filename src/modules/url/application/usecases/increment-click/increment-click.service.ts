import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDao } from '../../persistence/dao/url-dao.interface';

@Injectable()
export class IncrementClickUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(shortUrl: string): Promise<void> {
    await this.urlDao.incrementClick(shortUrl);
  }
}
