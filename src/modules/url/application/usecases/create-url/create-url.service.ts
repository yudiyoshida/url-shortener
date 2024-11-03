import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UrlService } from 'src/modules/url/domain/services/url.service';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { CreateUrlInputDto, CreateUrlOutputDto } from './dto/create-url.dto';

@Injectable()
export class CreateUrlUseCase {
  constructor(
    private readonly configService: ConfigService,
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(data: CreateUrlInputDto, accountId?: string): Promise<CreateUrlOutputDto> {
    const baseUrl = this.configService.get('APP_URL');

    let shortUrl = UrlService.generateShortUrl();

    do {
      const existingUrl = await this.urlDao.findByUrl(shortUrl);
      if (!existingUrl) {
        break;
      }
      shortUrl = UrlService.generateShortUrl();

    } while (true);

    const id = await this.urlDao.save({
      originalUrl: data.originalUrl,
      shortUrl,
      clicks: 0,
      accountId,
    });

    return { id, shortUrl: UrlService.formatShortUrl(baseUrl, shortUrl) };
  }
}
