import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ParamsDto } from 'src/shared/dto/params.dto';
import { QueriesDto } from 'src/shared/dto/queries.dto';
import { SuccessMessage } from 'src/shared/dto/success-message.dto';
import { Swagger } from 'src/shared/infra/openapi/swagger';
import { IPagination } from 'src/shared/value-objects/pagination/pagination';
import { UrlDaoDto } from '../../application/persistence/dao/url-dao.dto';
import { CreateUrlUseCase } from '../../application/usecases/create-url/create-url.service';
import { CreateUrlInputDto, CreateUrlOutputDto } from '../../application/usecases/create-url/dto/create-url.dto';
import { DeleteUrlUseCase } from '../../application/usecases/delete-url/delete-url.service';
import { GetAllUrlsUseCase } from '../../application/usecases/get-all-urls/get-all-urls.service';
import { UpdateUrlInputDto } from '../../application/usecases/update-url/dtos/update-url.dto';
import { UpdateUrlUseCase } from '../../application/usecases/update-url/update-url.service';

@Controller('urls')
export class UrlController {
  constructor(
    private readonly createUrlUseCase: CreateUrlUseCase,
    private readonly getAllUrlsUseCase: GetAllUrlsUseCase,
    private readonly updateUrlUseCase: UpdateUrlUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase
  ) {}

  @Post()
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para criar uma nova URL',
    applyBadRequest: true,
    createdResponse: CreateUrlOutputDto,
  })
  public async createUrl(@Body() body: CreateUrlInputDto): Promise<CreateUrlOutputDto> {
    return this.createUrlUseCase.execute(body);
  }

  @Get()
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para buscar todas as URLs',
    applyBadRequest: true,
    okPaginatedResponse: UrlDaoDto,
  })
  public async getAllUrls(@Query() queries: QueriesDto): Promise<IPagination<UrlDaoDto>> {
    return this.getAllUrlsUseCase.execute(queries.page, queries.size);
  }

  @Patch(':id')
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para atualizar uma URL',
    applyBadRequest: true,
    applyNotFound: true,
    okResponse: SuccessMessage,
  })
  public async updateUrl(@Param() params: ParamsDto, @Body() body: UpdateUrlInputDto): Promise<SuccessMessage> {
    return this.updateUrlUseCase.execute(params.id, body);
  }

  @Delete(':id')
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para deletar uma URL',
    applyBadRequest: true,
    applyNotFound: true,
    okResponse: SuccessMessage,
  })
  public async deleteUrl(@Param() params: ParamsDto): Promise<SuccessMessage> {
    return this.deleteUrlUseCase.execute(params.id);
  }
}
