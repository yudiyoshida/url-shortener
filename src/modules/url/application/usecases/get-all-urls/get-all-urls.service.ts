import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/shared/ioc/tokens';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';

@Injectable()
export class GetAllUrlsUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(): Promise<UrlDaoDto[]> {
    return this.urlDao.findAll();
  }
}
