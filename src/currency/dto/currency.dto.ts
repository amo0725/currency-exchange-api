import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryConvertCurrencyDTO {
  @ApiProperty({
    description: 'The currency to convert from',
    example: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  source: string;

  @ApiProperty({
    description: 'The currency to convert to',
    example: 'JPY',
  })
  @IsNotEmpty()
  @IsString()
  target: string;

  @ApiProperty({
    description: 'The amount to convert',
    example: '$1525',
  })
  @IsNotEmpty()
  @IsString()
  amount: string;
}
