import * as _ from 'lodash';
import { CURRENCIES } from './configs/currencies';
import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConvertCurrencyBO } from './bo/currency.bo';

@Injectable()
export class CurrencyService {
  async convert(
    source: string,
    target: string,
    amount: string
  ): Promise<ConvertCurrencyBO> {
    const conversionRate = this.getConversionRate(source, target);
    const trimmedAmount = this.trimCurrencySymbol(amount);
    const amountNumber = parseFloat(trimmedAmount);

    const convertedAmount = this.convertCurrency(conversionRate, amountNumber);
    const formattedAmount = this.formatCurrency(convertedAmount);

    const result = {
      source,
      target,
      amount: formattedAmount,
    };

    return ConvertCurrencyBO.plainToClass(result);
  }

  private formatCurrency(amount: number): string {
    const formattedAmount = _.round(amount, 2);
    const formattedAmountString = formattedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `$${formattedAmountString}`;
  }

  private trimCurrencySymbol(amount: string): string {
    return amount.replace(/[$,]/g, '');
  }

  private convertCurrency(conversionRate: number, amount: number): number {
    return amount * conversionRate;
  }

  private getConversionRate(source: string, target: string): number {
    if (!CURRENCIES[source] || !CURRENCIES[source][target]) {
      throw new HttpException(
        `Conversion rate not available for ${source} to ${target}`,
        HttpStatus.BAD_REQUEST
      );
    }
    return CURRENCIES[source][target];
  }
}
