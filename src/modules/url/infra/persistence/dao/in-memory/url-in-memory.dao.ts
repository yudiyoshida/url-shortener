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

  public async findById(id: string): Promise<UrlDaoDto | null> {
    return this._urls.find((u) => u.id === id) ?? null;
  }

  public async findByUrl(url: string): Promise<UrlDaoDto | null> {
    return this._urls.find((u) => u.shortUrl === url) ?? null;
  }

  public async save(url: Url): Promise<string> {
    const id = crypto.randomUUID();

    this._urls.push({
      id,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return id;
  }

  public async update(id: string, newOriginalUrl: string): Promise<void> {
    const urlIndex = this._urls.findIndex((u) => u.id === id);
    if (urlIndex === -1) {
      return;
    }

    this._urls[urlIndex].originalUrl = newOriginalUrl;
    this._urls[urlIndex].updatedAt = new Date();
  }

  public async delete(id: string): Promise<void> {
    this._urls = this._urls.filter((u) => u.id !== id);
  }
}
