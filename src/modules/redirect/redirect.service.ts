import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GetUrlUseCase } from '../url/application/usecases/get-url/get-url.service';
import { IncrementClickUseCase } from '../url/application/usecases/increment-click/increment-click.service';

@Injectable()
export class RedirectService {
  constructor(
    private readonly getUrlUseCase: GetUrlUseCase,
    private readonly incrementClickUseCase: IncrementClickUseCase,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  public async execute(shortUrl: string): Promise<string> {
    const cachedUrl = await this.cacheManager.get<string>(shortUrl);

    const originalUrl = cachedUrl
      ? cachedUrl
      : await this.getAndCacheUrl(shortUrl);

    await this.incrementClickUseCase.execute(shortUrl);

    return originalUrl;
  };

  private async getAndCacheUrl(shortUrl: string): Promise<string> {
    const url = await this.getUrlUseCase.execute(shortUrl);
    await this.cacheManager.set(shortUrl, url.originalUrl);

    return url.originalUrl;
  }
}
