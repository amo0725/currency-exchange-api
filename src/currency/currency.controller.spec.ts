import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { ConvertCurrencyAO } from './ao/currency.ao';

describe('CurrencyController', () => {
  let currencyController: CurrencyController;
  let currencyService: jest.Mocked<CurrencyService>;

  beforeEach(async () => {
    const mockCurrencyService = {
      convert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: mockCurrencyService,
        },
      ],
    }).compile();

    currencyController = module.get<CurrencyController>(CurrencyController);
    currencyService = module.get<CurrencyService>(
      CurrencyService
    ) as jest.Mocked<CurrencyService>;
  });

  it('should be defined', () => {
    expect(currencyController).toBeDefined();
  });

  describe('convert', () => {
    it('should throw an error for an unsupported source currency', async () => {
      const unsupportedCurrencyDto = {
        source: 'ZZZ', // Assuming ZZZ is not a supported currency
        target: 'JPY',
        amount: '$1525',
      };

      currencyService.convert.mockImplementationOnce(() => {
        throw new Error('Unsupported currency');
      });

      await expect(
        currencyController.convert(unsupportedCurrencyDto)
      ).rejects.toThrow('Unsupported currency');
    });

    it('should throw an error for an unsupported target currency', async () => {
      const unsupportedCurrencyDto = {
        source: 'USD',
        target: 'ZZZ', // Assuming ZZZ is not a supported currency
        amount: '$1525',
      };

      currencyService.convert.mockImplementationOnce(() => {
        throw new Error('Unsupported currency');
      });

      await expect(
        currencyController.convert(unsupportedCurrencyDto)
      ).rejects.toThrow('Unsupported currency');
    });

    it('should return converted amount', async () => {
      const queryDto = {
        source: 'USD',
        target: 'JPY',
        amount: '$1525',
      };

      currencyService.convert.mockResolvedValueOnce({
        source: 'USD',
        target: 'JPY',
        amount: '$170496.53',
      });

      const response = await currencyController.convert(queryDto);

      expect(response).toBeInstanceOf(ConvertCurrencyAO);
      expect(response.amount).toBe('$170496.53');
      expect(currencyService.convert).toHaveBeenCalledWith(
        queryDto.source,
        queryDto.target,
        queryDto.amount
      );
    });
  });
});
