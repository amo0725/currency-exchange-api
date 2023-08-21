import * as _ from 'lodash';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import { CURRENCIES } from './configs/currencies';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CurrencyService', () => {
  let currencyService: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyService],
    }).compile();

    currencyService = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(currencyService).toBeDefined();
  });

  describe('convert', () => {
    it('should convert currency successfully', async () => {
      // Assuming CURRENCIES contains a conversion rate from USD to JPY.
      const result = await currencyService.convert('USD', 'JPY', '$1525');
      expect(result.source).toBe('USD');
      expect(result.target).toBe('JPY');
      expect(result.amount).toBe(
        `$${_.round(1525 * CURRENCIES['USD']['JPY'], 2).toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`
      );
    });

    it('should throw error for unsupported source currency', async () => {
      await expect(
        currencyService.convert('XYZ', 'JPY', '$1525')
      ).rejects.toThrow(
        new HttpException(
          `Conversion rate not available for XYZ to JPY`,
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it('should throw error for unsupported target currency', async () => {
      await expect(
        currencyService.convert('USD', 'XYZ', '$1525')
      ).rejects.toThrow(
        new HttpException(
          `Conversion rate not available for USD to XYZ`,
          HttpStatus.BAD_REQUEST
        )
      );
    });

    it('should handle non-numeric amount input', async () => {
      // Assuming CURRENCIES contains a conversion rate from USD to JPY.
      const result = await currencyService.convert('USD', 'JPY', '$1525a'); // Here "a" is a non-numeric character.
      expect(result.source).toBe('USD');
      expect(result.target).toBe('JPY');
      const expectedAmount = _.round(
        parseFloat('1525') * CURRENCIES['USD']['JPY'],
        2
      ).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result.amount).toBe(`$${expectedAmount}`);
    });
  });
});
