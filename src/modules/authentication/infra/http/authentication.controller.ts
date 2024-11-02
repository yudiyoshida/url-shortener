import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginInputDto, LoginOutputDto } from '../../application/usecases/login/dtos/login.dto';
import { LoginUseCase } from '../../application/usecases/login/login.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: LoginInputDto): Promise<LoginOutputDto> {
    return this.loginUseCase.execute(body);
  }
}
