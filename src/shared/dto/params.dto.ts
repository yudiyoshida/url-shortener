import { IsNotEmpty, IsString } from 'class-validator';

export class ParamsDto {
  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  id: string;
}
