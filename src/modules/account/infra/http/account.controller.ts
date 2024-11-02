import { Body, Controller, Post } from '@nestjs/common';
import { Swagger } from 'src/shared/infra/openapi/swagger';
import { RegisterInputDto, RegisterOutputDto } from '../../application/usecases/register/dtos/register.dto';
import { RegisterUseCase } from '../../application/usecases/register/register.service';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post()
  @Swagger({
    tags: ['Cadastro'],
    summary: 'Rota utilizada para criar uma conta na aplicação',
    applyBadRequest: true,
    applyConflict: true,
    createdResponse: RegisterOutputDto,
  })
  public async register(@Body() body: RegisterInputDto): Promise<RegisterOutputDto> {
    return this.registerUseCase.execute(body);
  }
}
