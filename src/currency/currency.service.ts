import * as _ from 'lodash';
import { CURRENCIES } from './configs/currencies';
import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConvertCurrencyBO } from './bo/currency.bo';

@Injectable()
export class CurrencyService {
  /**
   * Convert a given amount from a source currency to a target currency.
   * @param source - The source currency code.
   * @param target - The target currency code.
   * @param amount - The amount to be converted, represented as a string with a currency symbol.
   * @returns - A promise that resolves to a ConvertCurrencyBO object containing the conversion details.
   */
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

  /**
   * Format a given amount to a standard currency format.
   * @param amount - The amount to be formatted.
   * @returns - The formatted amount as a string with a currency symbol.
   */
  private formatCurrency(amount: number): string {
    const formattedAmount = _.round(amount, 2);
    const formattedAmountString = formattedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `$${formattedAmountString}`;
  }

  /**
   * Remove currency symbols and commas from a given amount string.
   * @param amount - The amount string with potential currency symbols and commas.
   * @returns - The cleaned amount string.
   */
  private trimCurrencySymbol(amount: string): string {
    return amount.replace(/[$,]/g, '');
  }

  /**
   * Convert an amount using a given conversion rate.
   * @param conversionRate - The rate to use for conversion.
   * @param amount - The amount to be converted.
   * @returns - The converted amount.
   */
  private convertCurrency(conversionRate: number, amount: number): number {
    return amount * conversionRate;
  }

  /**
   * Retrieve the conversion rate between a source and target currency.
   * @param source - The source currency code.
   * @param target - The target currency code.
   * @returns - The conversion rate.
   * @throws - Throws an HttpException if the conversion rate is not available.
   */
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
