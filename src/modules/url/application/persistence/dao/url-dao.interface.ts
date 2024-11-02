import { Url } from 'src/modules/url/domain/value-objects/url.vo';
import { UrlDaoDto } from './url-dao.dto';

export interface UrlDao {
  findAll(): Promise<UrlDaoDto[]>;
  findByUrl(url: string): Promise<UrlDaoDto | null>;
  save(url: Url): Promise<void>;
}
