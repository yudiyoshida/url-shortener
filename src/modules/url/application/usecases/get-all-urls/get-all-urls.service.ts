import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/shared/ioc/tokens';
import { IPagination, Pagination } from 'src/shared/value-objects/pagination/pagination';
import { UrlDaoDto } from '../../persistence/dao/url-dao.dto';
import { UrlDao } from '../../persistence/dao/url-dao.interface';

@Injectable()
export class GetAllUrlsUseCase {
  constructor(
    @Inject(TOKENS.UrlDao) private readonly urlDao: UrlDao
  ) {}

  public async execute(page?: number, size?: number): Promise<IPagination<UrlDaoDto>> {
    const urls = await this.urlDao.findAll(page, size);

    return new Pagination(urls).getDto();
  }
}
