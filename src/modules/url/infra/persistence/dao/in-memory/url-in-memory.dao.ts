/* eslint-disable @typescript-eslint/no-unused-vars */
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { UrlDaoDto } from 'src/modules/url/application/persistence/dao/url-dao.dto';
import { UrlDao, UrlSaveDto } from 'src/modules/url/application/persistence/dao/url-dao.interface';

@Injectable()
export class UrlInMemoryAdapterDao implements UrlDao {
  private _urls: UrlDaoDto[] = [];

  public async findAll(accountId: string, page?: number, size?: number): Promise<[UrlDaoDto[], number]> {
    const urls = this._urls.filter((u) => u.accountId === accountId);

    return [urls, urls.length];
  }

  public async findById(id: string): Promise<UrlDaoDto | null> {
    return this._urls.find((u) => u.id === id) ?? null;
  }

  public async findByUrl(url: string): Promise<UrlDaoDto | null> {
    return this._urls.find((u) => u.shortUrl === url) ?? null;
  }

  public async save(data: UrlSaveDto): Promise<string> {
    const id = crypto.randomUUID();

    this._urls.push({
      ...data,
      id,
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

  public async incrementClick(shortUrl: string): Promise<void> {
    const url = await this.findByUrl(shortUrl);
    if (!url) {
      return;
    }

    url.clicks++;
  }
}
