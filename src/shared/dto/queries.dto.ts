import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { StringToNumber } from '../infra/validators/decorators/string-number';

export class QueriesDto {
  @IsOptional()
  @IsInt({ message: '$property deve ser um número inteiro' })
  @IsPositive({ message: '$property deve ser um número positivo' })
  @StringToNumber()
  page?: number;

  @IsOptional()
  @IsInt({ message: '$property deve ser um número inteiro' })
  @IsPositive({ message: '$property deve ser um número positivo' })
  @StringToNumber()
  size?: number;
}
