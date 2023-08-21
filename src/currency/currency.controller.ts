import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { QueryConvertCurrencyDTO } from './dto/currency.dto';
import { ConvertCurrencyAO } from './ao/currency.ao';

@ApiTags('currency')
@Controller({ path: 'currency', version: '1' })
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  /**
   * Endpoint to convert an amount from a source currency to a target currency.
   * @query dto - QueryConvertCurrencyDTO
   * @returns - ConvertCurrencyAO
   */
  @Get('convert')
  async convert(
    @Query() dto: QueryConvertCurrencyDTO
  ): Promise<ConvertCurrencyAO> {
    const { source, target, amount } = dto;
    const convertCurrencyBO = await this.currencyService.convert(
      source,
      target,
      amount
    );

    const { amount: convertedAmount } = convertCurrencyBO;

    const response = {
      amount: convertedAmount,
    };

    return ConvertCurrencyAO.plainToClass(response);
  }
}
