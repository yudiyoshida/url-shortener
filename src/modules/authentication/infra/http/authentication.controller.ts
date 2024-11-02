import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Swagger } from 'src/shared/infra/openapi/swagger';
import { LoginInputDto, LoginOutputDto } from '../../application/usecases/login/dtos/login.dto';
import { LoginUseCase } from '../../application/usecases/login/login.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Swagger({
    tags: ['Autenticação'],
    summary: 'Rota utilizada para realizar o login na aplicação',
    applyBadRequest: true,
    okResponse: LoginOutputDto,
  })
  public async login(@Body() body: LoginInputDto): Promise<LoginOutputDto> {
    return this.loginUseCase.execute(body);
  }
}
