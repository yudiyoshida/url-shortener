import { Body, Controller, Post } from '@nestjs/common';
import { RegisterInputDto, RegisterOutputDto } from '../../application/usecases/register/dtos/register.dto';
import { RegisterUseCase } from '../../application/usecases/register/register.service';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post()
  public async register(@Body() body: RegisterInputDto): Promise<RegisterOutputDto> {
    return this.registerUseCase.execute(body);
  }
}
