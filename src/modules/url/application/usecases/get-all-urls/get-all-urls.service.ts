import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlService } from 'src/modules/url/domain/services/url.service';
import { TOKENS } from 'src/shared/ioc/tokens';
import { IPagination, Pagination } from 'src/shared/value-objects/pagination/pagination';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';

@Injectable()
export class GetAllUrlsUseCase {
  constructor(
    private readonly configService: ConfigService,
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(accountId: string, page?: number, size?: number): Promise<IPagination<UrlDaoDto>> {
    const domain = this.configService.get('APP_URL');

    const [urls, count] = await this.urlDao.findAll(accountId, page, size);

    const formattedUrls = urls.map((url) => ({
      ...url,
      shortUrl: UrlService.formatShortUrl(domain, url.shortUrl),
    }));

    return new Pagination([formattedUrls, count]).getDto();
  }
}
