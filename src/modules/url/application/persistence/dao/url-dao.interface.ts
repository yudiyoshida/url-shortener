import { UrlDaoDto } from './url-dao.dto';

export interface UrlDao {
  findAll(accountId: string, page?: number, size?: number): Promise<[UrlDaoDto[], number]>;
  findById(id: string): Promise<UrlDaoDto | null>;
  findByUrl(url: string): Promise<UrlDaoDto | null>;
  save(data: UrlSaveDto): Promise<string>;
  update(id: string, newOriginalUrl: string): Promise<void>;
  incrementClick(shortUrl: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface UrlSaveDto {
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  accountId?: string;
}
