import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Trim } from 'src/shared/infra/validators/decorators/trim';

export class RegisterInputDto {
  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  @Trim()
  name: string;

  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  @IsEmail({}, { message: '$property deve ser um email válido' })
  @Trim()
  email: string;

  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  @MinLength(6, { message: '$property deve ter no mínimo 6 caracteres' })
  password: string;
}

export class RegisterOutputDto {
  id: string;
}
