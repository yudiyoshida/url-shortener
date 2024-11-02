import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/shared/infra/validators/decorators/trim';

export class LoginInputDto {
  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  @Trim()
  email: string;

  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  password: string;
}

export class LoginOutputDto {
  token: string;
}
