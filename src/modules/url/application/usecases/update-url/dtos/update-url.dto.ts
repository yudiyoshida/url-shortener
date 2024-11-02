import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUrlInputDto {
  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  newUrl: string;
}
