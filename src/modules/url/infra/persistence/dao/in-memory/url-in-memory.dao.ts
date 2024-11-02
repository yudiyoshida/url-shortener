import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { UrlDaoDto } from 'src/modules/url/application/persistence/dao/url-dao.dto';
import { UrlDao } from 'src/modules/url/application/persistence/dao/url-dao.interface';
import { Url } from 'src/modules/url/domain/value-objects/url.vo';

@Injectable()
export class UrlInMemoryAdapterDao implements UrlDao {
  private _urls: UrlDaoDto[] = [];

  public async findAll(): Promise<UrlDaoDto[]> {
    return this._urls;
  }

  public async findByUrl(url: string): Promise<UrlDaoDto | null> {
    return this._urls.find((u) => u.shortUrl === url) ?? null;
  }

  public async save(url: Url): Promise<void> {
    this._urls.push({
      id: crypto.randomUUID(),
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
