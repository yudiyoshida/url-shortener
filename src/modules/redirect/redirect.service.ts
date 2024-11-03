import { Injectable } from '@nestjs/common';
import { GetUrlUseCase } from '../url/application/usecases/get-url/get-url.service';

@Injectable()
export class RedirectService {
  constructor(
    private readonly getUrlUseCase: GetUrlUseCase
  ) {}

  public async execute(shortUrl: string): Promise<string> {
    const url = await this.getUrlUseCase.execute(shortUrl);

    return url.originalUrl;
  };
}
