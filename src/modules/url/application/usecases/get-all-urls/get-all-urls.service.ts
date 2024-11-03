import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    const [urls, count] = await this.urlDao.findAll(accountId, page, size);

    const formattedUrls = urls.map((url) => ({
      ...url,
      shortUrl: this.formatShortUrl(url.shortUrl),
    }));

    return new Pagination([formattedUrls, count]).getDto();
  }

  private formatShortUrl(shortUrl: string): string {
    return `${this.configService.get('APP_URL')}/${shortUrl}`;
  }
}
