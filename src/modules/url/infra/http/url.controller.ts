import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ParamsDto } from 'src/shared/dto/params.dto';
import { SuccessMessage } from 'src/shared/dto/success-message.dto';
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
  public async createUrl(@Body() body: CreateUrlInputDto): Promise<CreateUrlOutputDto> {
    return this.createUrlUseCase.execute(body);
  }

  @Get()
  public async getAllUrls(): Promise<IPagination<UrlDaoDto>> {
    return this.getAllUrlsUseCase.execute();
  }

  @Patch(':id')
  public async updateUrl(@Param() params: ParamsDto, @Body() body: UpdateUrlInputDto): Promise<SuccessMessage> {
    return this.updateUrlUseCase.execute(params.id, body);
  }

  @Delete(':id')
  public async deleteUrl(@Param() params: ParamsDto): Promise<SuccessMessage> {
    return this.deleteUrlUseCase.execute(params.id);
  }
}
