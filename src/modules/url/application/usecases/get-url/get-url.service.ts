import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Errors } from 'src/shared/errors/messages';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';

@Injectable()
export class GetUrlUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(shortUrl: string): Promise<UrlDaoDto> {
    const url = await this.urlDao.findByUrl(shortUrl);

    if (!url) {
      throw new NotFoundException(Errors.URL_NOT_FOUND);
    }
    return url;
  }
}
