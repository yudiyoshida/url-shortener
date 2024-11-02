import { Body, Controller, Get, Post } from '@nestjs/common';
import { UrlDaoDto } from '../../application/persistence/dao/url-dao.dto';
import { CreateUrlUseCase } from '../../application/usecases/create-url/create-url.service';
import { CreateUrlInputDto, CreateUrlOutputDto } from '../../application/usecases/create-url/dto/create-url.dto';
import { GetAllUrlsUseCase } from '../../application/usecases/get-all-urls/get-all-urls.service';

@Controller('urls')
export class UrlController {
  constructor(
    private readonly createUrlUseCase: CreateUrlUseCase,
    private readonly getAllUrlsUseCase: GetAllUrlsUseCase
  ) {}

  @Post()
  public async createUrl(@Body() body: CreateUrlInputDto): Promise<CreateUrlOutputDto> {
    return this.createUrlUseCase.execute(body);
  }

  @Get()
  public async getAllUrls(): Promise<UrlDaoDto[]> {
    return this.getAllUrlsUseCase.execute();
  }
}
