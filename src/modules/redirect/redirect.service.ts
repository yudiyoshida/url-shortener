import { Injectable } from '@nestjs/common';
import { GetUrlUseCase } from '../url/application/usecases/get-url/get-url.service';
import { IncrementClickUseCase } from '../url/application/usecases/increment-click/increment-click.service';

@Injectable()
export class RedirectService {
  constructor(
    private readonly getUrlUseCase: GetUrlUseCase,
    private readonly incrementClickUseCase: IncrementClickUseCase,
  ) {}

  public async execute(shortUrl: string): Promise<string> {
    const url = await this.getUrlUseCase.execute(shortUrl);

    await this.incrementClickUseCase.execute(url.shortUrl);

    return url.originalUrl;
  };
}
