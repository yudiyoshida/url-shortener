import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @ApiExcludeEndpoint()
  @Get()
  public async getShortUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<void> {
    const originalUrl = await this.redirectService.execute(shortUrl);

    res.redirect(originalUrl);
  }
}
