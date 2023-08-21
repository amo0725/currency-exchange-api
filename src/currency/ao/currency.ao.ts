import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';

export class ConvertCurrencyAO {
  @Expose()
  @ApiProperty({
    description: 'status message',
    example: 'success',
  })
  msg: string;

  @Expose()
  @ApiProperty({
    description: 'The amount after conversion',
    example: '$170496.53',
  })
  amount: string;

  static plainToClass(dto: any) {
    return (
      dto &&
      plainToInstance(ConvertCurrencyAO, dto, {
        excludeExtraneousValues: true,
      })
    );
  }
}
