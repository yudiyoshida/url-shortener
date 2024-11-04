import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SuccessMessage } from 'src/shared/dto/success-message.dto';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetUrlByIdAndAccountIdUseCase } from '../get-url-by-id-and-account-id/get-url-by-id-and-account-id.service';
import { UpdateUrlInputDto } from './dtos/update-url.dto';

@Injectable()
export class UpdateUrlUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly getUrlByIdAndAccountIdUseCase: GetUrlByIdAndAccountIdUseCase,
  ) {}

  public async execute(urlId: string, accountId: string, data: UpdateUrlInputDto): Promise<SuccessMessage> {
    const url = await this.getUrlByIdAndAccountIdUseCase.execute(urlId, accountId);

    await this.urlDao.update(url.id, data.newUrl);
    await this.cacheManager.del(url.shortUrl);

    return { message: 'Url atualizada com sucesso.' };
  }
}
