import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Url } from 'src/modules/url/domain/value-objects/url.vo';
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

    let url = new Url(data.originalUrl);

    do {
      const existingUrl = await this.urlDao.findByUrl(url.shortUrl);
      if (!existingUrl) {
        break;
      }
      url = new Url(data.originalUrl);

    } while (true);

    const id = await this.urlDao.save(url, accountId);

    return { id, shortUrl: `${baseUrl}/${url.shortUrl}` };
  }
}
