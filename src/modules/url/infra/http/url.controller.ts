import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Account } from 'src/modules/authentication/decorators/account.decorator';
import { Protected } from 'src/modules/authentication/decorators/required-role.decorator';
import { PayloadDto } from 'src/modules/authentication/dtos/payload.dto';
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

@Controller()
export class UrlController {
  constructor(
    private readonly createUrlUseCase: CreateUrlUseCase,
    private readonly getAllUrlsUseCase: GetAllUrlsUseCase,
    private readonly updateUrlUseCase: UpdateUrlUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase
  ) {}

  @Post()
  @Protected('partial')
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para criar uma nova URL',
    applyBadRequest: true,
    createdResponse: CreateUrlOutputDto,
  })
  public async createUrl(@Body() body: CreateUrlInputDto, @Account() acc: PayloadDto): Promise<CreateUrlOutputDto> {
    return this.createUrlUseCase.execute(body, acc?.sub);
  }

  @Get()
  @Protected('full')
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para buscar todas as URLs',
    applyBadRequest: true,
    okPaginatedResponse: UrlDaoDto,
  })
  public async getAllUrls(@Query() queries: QueriesDto, @Account() acc: PayloadDto): Promise<IPagination<UrlDaoDto>> {
    return this.getAllUrlsUseCase.execute(acc.sub, queries.page, queries.size);
  }

  @Patch(':id')
  @Protected('full')
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para atualizar uma URL',
    applyBadRequest: true,
    applyNotFound: true,
    okResponse: SuccessMessage,
  })
  public async updateUrl(
    @Param() params: ParamsDto,
    @Account() acc: PayloadDto,
    @Body() body: UpdateUrlInputDto
  ): Promise<SuccessMessage> {
    return this.updateUrlUseCase.execute(params.id, acc.sub, body);
  }

  @Delete(':id')
  @Protected('full')
  @Swagger({
    tags: ['Url'],
    summary: 'Rota utilizada para deletar uma URL',
    applyBadRequest: true,
    applyNotFound: true,
    okResponse: SuccessMessage,
  })
  public async deleteUrl(@Param() params: ParamsDto, @Account() acc: PayloadDto): Promise<SuccessMessage> {
    return this.deleteUrlUseCase.execute(params.id, acc.sub);
  }
}
