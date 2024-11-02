import { Url } from 'src/modules/url/domain/value-objects/url.vo';
import { UrlDaoDto } from './url-dao.dto';

export interface UrlDao {
  findAll(): Promise<UrlDaoDto[]>;
  findById(id: string): Promise<UrlDaoDto | null>;
  findByUrl(url: string): Promise<UrlDaoDto | null>;
  save(url: Url): Promise<string>;
  update(id: string, newOriginalUrl: string): Promise<void>;
  delete(id: string): Promise<void>;
}
