import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SuccessMessage } from 'src/shared/dto/success-message.dto';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetUrlByIdAndAccountIdUseCase } from '../get-url-by-id-and-account-id/get-url-by-id-and-account-id.service';

@Injectable()
export class DeleteUrlUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly getUrlByIdAndAccountIdUseCase: GetUrlByIdAndAccountIdUseCase,
  ) {}

  public async execute(urlId: string, accountId: string): Promise<SuccessMessage> {
    const url = await this.getUrlByIdAndAccountIdUseCase.execute(urlId, accountId);

    await this.urlDao.delete(url.id);
    await this.cacheManager.del(url.shortUrl);

    return { message: 'Url deletada com sucesso.' };
  }
}
