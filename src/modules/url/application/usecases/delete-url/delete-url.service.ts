import { Inject, Injectable } from '@nestjs/common';
import { SuccessMessage } from 'src/shared/dto/success-message.dto';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDao } from '../../persistence/dao/url-dao.interface';
import { GetUrlByIdAndAccountIdUseCase } from '../get-url-by-id-and-account-id/get-url-by-id-and-account-id.service';

@Injectable()
export class DeleteUrlUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao,
    private readonly getUrlByIdAndAccountIdUseCase: GetUrlByIdAndAccountIdUseCase
  ) {}

  public async execute(urlId: string, accountId: string): Promise<SuccessMessage> {
    const url = await this.getUrlByIdAndAccountIdUseCase.execute(urlId, accountId);

    await this.urlDao.delete(url.id);

    return { message: 'Url deletada com sucesso.' };
  }
}
