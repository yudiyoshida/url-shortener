import { Url } from 'src/modules/url/domain/value-objects/url.vo';

export interface UrlDao {
  findByUrl(url: string): Promise<Url | null>;
  save(url: Url): Promise<void>;
}
