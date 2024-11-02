import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuccessMessage } from 'src/shared/dto/success-message.dto';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDao } from '../../persistence/dao/url-dao.interface';

@Injectable()
export class DeleteUrlUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(id: string): Promise<SuccessMessage> {
    const urlExists = await this.urlDao.findById(id);
    if (!urlExists) {
      throw new NotFoundException('Url não encontrada na base de dados.');
    }

    await this.urlDao.delete(id);

    return { message: 'Url deletada com sucesso.' };
  }
}
