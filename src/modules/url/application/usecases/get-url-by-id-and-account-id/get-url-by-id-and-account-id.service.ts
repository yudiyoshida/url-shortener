import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Errors } from 'src/shared/errors/messages';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';

@Injectable()
export class GetUrlByIdAndAccountIdUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(urlId: string, accountId: string): Promise<UrlDaoDto> {
    const url = await this.urlDao.findById(urlId);

    if (!url || url.accountId !== accountId) {
      throw new NotFoundException(Errors.URL_NOT_FOUND);
    }
    return url;
  }
}
