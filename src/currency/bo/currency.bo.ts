import { Expose, plainToInstance } from 'class-transformer';
import { ICurrencyBase } from '../interfaces/currency.interface';

export class ConvertCurrencyBase implements ICurrencyBase {
  @Expose()
  source: string;
  @Expose()
  target: string;
  @Expose()
  amount: string;
}

export class ConvertCurrencyBO extends ConvertCurrencyBase {
  static plainToClass(dto: ConvertCurrencyBO) {
    return (
      dto &&
      plainToInstance(ConvertCurrencyBO, dto, {
        excludeExtraneousValues: true,
      })
    );
  }
}
