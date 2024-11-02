import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlInputDto {
  @IsString({ message: '$property deve ser um texto' })
  @IsNotEmpty({ message: '$property é um campo obrigatório' })
  originalUrl: string;
}

export class CreateUrlOutputDto {
  id: string;
  shortUrl: string;
}
