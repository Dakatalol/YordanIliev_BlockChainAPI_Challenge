import { expect } from 'chai';
import { HttpClient } from '../utils/HttpClient';
import { QuotePage } from '../pages/QuotePage';
import { config } from '../config/environment';
import { QuoteValidators } from '../data/quoteValidators';
import { JUPITER_ERROR_CODES } from '../constants/constants';
import { VALID_SCENARIOS, INVALID_SCENARIOS, MILLION_SOL_TO_USDC } from '../data/quoteData';

describe('Jupiter Quote API Tests', () => {
  let httpClient: HttpClient;
  let quotePage: QuotePage;

  before(() => {
    httpClient = new HttpClient(config.JUPITER_BASE_URL, { type: 'none' });
    quotePage = new QuotePage(httpClient);
  });

  describe('Happy Path Tests', () => {
    it('TC-01: Should get valid quote for SOL to USDC swap', async () => {
      const response = await quotePage.getQuote(VALID_SCENARIOS.SOL_TO_USDC_BASIC);
      QuoteValidators.validateSuccessfulQuote(response, VALID_SCENARIOS.SOL_TO_USDC_BASIC);
    });

    it('TC-02: Should get valid quote for USDC to SOL swap (reverse)', async () => {
      const response = await quotePage.getQuote(VALID_SCENARIOS.USDC_TO_SOL_REVERSE);
      QuoteValidators.validateSuccessfulQuote(response, VALID_SCENARIOS.USDC_TO_SOL_REVERSE);
    });

    it('TC-03: Should get valid quote for USDC to USDT swap (stablecoins)', async () => {
      const response = await quotePage.getQuote(VALID_SCENARIOS.USDC_TO_USDT_STABLE);
      QuoteValidators.validateStablecoinSwap(response, VALID_SCENARIOS.USDC_TO_USDT_STABLE);
    });
  });

  describe('Input Validation Tests', () => {
    it('TC-04: Should reject missing required parameter inputMint', async () => {
      const response = await quotePage.getQuote(INVALID_SCENARIOS.MISSING_INPUT_MINT as any);
      QuoteValidators.validateBadRequest(response, ['inputMint']);
    });

    it('TC-05: Should reject invalid token mint format', async () => {
      const response = await quotePage.getQuote(INVALID_SCENARIOS.INVALID_TOKEN_FORMAT);
      QuoteValidators.validateBadRequest(response, ['Query parameter inputMint cannot be parsed']);
    });

    it('TC-06: Should reject zero amount', async () => {
      const response = await quotePage.getQuote(INVALID_SCENARIOS.ZERO_AMOUNT);
      QuoteValidators.validateBadRequest(
        response,
        ['Could not find any route'],
        JUPITER_ERROR_CODES.COULD_NOT_FIND_ANY_ROUTE
      );
    });

    it('TC-07: Should reject same input and output mint', async () => {
      const response = await quotePage.getQuote(INVALID_SCENARIOS.SAME_INPUT_OUTPUT);
      QuoteValidators.validateBadRequest(
        response,
        ['Input and output mints are not allowed to be equal'],
        JUPITER_ERROR_CODES.CIRCULAR_ARBITRAGE_IS_DISABLED
      );
    });
  });

  describe('Business Logic Tests', () => {
    it('TC-08: Should calculate slippage correctly', async () => {
      const response = await quotePage.getQuote(VALID_SCENARIOS.SLIPPAGE_CALCULATION_TEST);
      QuoteValidators.validateSlippageCalculation(
        response,
        VALID_SCENARIOS.SLIPPAGE_CALCULATION_TEST
      );
    });

    it('TC-09: Should return direct routes only when requested', async () => {
      const response = await quotePage.getQuote(VALID_SCENARIOS.DIRECT_ROUTES_ONLY);
      QuoteValidators.validateDirectRoutesOnly(response, VALID_SCENARIOS.DIRECT_ROUTES_ONLY);
    });
  });

  describe('Error Handling Tests', () => {
    it('TC-10: Should handle non-existent token mint', async () => {
      const response = await quotePage.getQuote(INVALID_SCENARIOS.NON_EXISTENT_TOKEN);
      QuoteValidators.validateBadRequest(response, ['Query parameter inputMint cannot be parsed']);
    });
  });

  describe('Large Amount Tests', () => {
    it('TC-11: Should return multi-hop routes for large SOL amount (1M SOL)', async () => {
      const response = await quotePage.getQuote(MILLION_SOL_TO_USDC);

      // Validate successful quote response
      QuoteValidators.validateSuccessfulQuote(response, MILLION_SOL_TO_USDC);

      // Verify that large amounts require multi-hop routing
      expect(response.data.routePlan).to.be.an('array');
      expect(response.data.routePlan.length).to.be.greaterThan(
        1,
        'Large amounts should require multiple routes to handle liquidity requirements'
      );
    });

    it('TC-12: Should distribute large amounts across multiple routes efficiently', async () => {
      const response = await quotePage.getQuote(MILLION_SOL_TO_USDC);

      // Validate successful quote response
      QuoteValidators.validateSuccessfulQuote(response, MILLION_SOL_TO_USDC);

      // Verify multiple routes are used for large amounts
      expect(response.data.routePlan).to.be.an('array');
      expect(response.data.routePlan.length).to.be.greaterThan(
        1,
        'Large swap amounts should be distributed across multiple routes'
      );

      // Verify route distribution logic
      const routePercentages = response.data.routePlan.map(route => route.percent);
      const totalPercent = routePercentages.reduce((sum, percent) => sum + percent, 0);
      expect(totalPercent).to.equal(100, 'Route percentages must sum to exactly 100%');
    });
  });

  describe('Response Schema Validation', () => {
    it('TC-13: Should validate complete quote response schema structure', async () => {
      const response = await quotePage.getQuote(VALID_SCENARIOS.SOL_TO_USDC_BASIC);

      QuoteValidators.validateResponseSchema(response);
    });
  });
});
