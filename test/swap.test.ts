import { expect } from 'chai';
import { HttpClient } from '../utils/HttpClient';
import { SwapPage } from '../pages/SwapPage';
import { QuotePage } from '../pages/QuotePage';
import { config } from '../config/environment';
import { PRIORITY_FEES, VALID_USER_PUBLIC_KEY } from '../constants/constants';
import { Logger } from '../utils/Logger';
import {
  SOL_TO_USDC_BASIC,
  USDC_TO_SOL_REVERSE,
  USDC_TO_USDT_STABLE,
  MILLION_SOL_TO_USDC,
} from '../data/quoteData';

describe('Jupiter Swap API Tests', () => {
  let httpClient: HttpClient;
  let swapPage: SwapPage;
  let quotePage: QuotePage;

  before(() => {
    httpClient = new HttpClient(config.JUPITER_BASE_URL, { type: 'none' });
    swapPage = new SwapPage(httpClient);
    quotePage = new QuotePage(httpClient);
  });

  describe('Happy Path Tests', () => {
    it('TC-01: Basic Swap Transaction - Generate swap transaction with valid quote response', async () => {
      // First get a fresh quote
      const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quoteResponse.status).to.equal(200);

      // Input: Fresh quote response + valid userPublicKey
      const swapRequest = {
        quoteResponse: quoteResponse.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
      };

      const response = await swapPage.postSwap(swapRequest);

      // Expected: 200 OK, returns base64-encoded swapTransaction
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('swapTransaction');
      expect(response.data.swapTransaction).to.be.a('string');
      expect(response.data.swapTransaction).to.not.be.empty;
      expect(response.data.swapTransaction).to.match(
        /^[A-Za-z0-9+/]+=*$/,
        'Should be valid base64'
      );

      // Validate required response fields
      expect(response.data).to.have.property('lastValidBlockHeight');
      expect(response.data.lastValidBlockHeight).to.be.a('number');
      expect(response.data.lastValidBlockHeight).to.be.greaterThan(0);
    });

    it('TC-02: Swap with Priority Fees - Create swap with custom priority fee settings', async () => {
      // Test different priority fee levels
      const priorityLevels = [
        { name: 'low', fee: PRIORITY_FEES.LOW },
        { name: 'medium', fee: PRIORITY_FEES.MEDIUM },
        { name: 'high', fee: PRIORITY_FEES.HIGH },
        { name: 'very high', fee: PRIORITY_FEES.VERY_HIGH },
      ];

      for (const level of priorityLevels) {
        // First get a fresh quote
        const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
        expect(quoteResponse.status).to.equal(200);

        // Input: Fresh quote + prioritizationFeeLamports
        const swapRequest = {
          quoteResponse: quoteResponse.data,
          userPublicKey: VALID_USER_PUBLIC_KEY,
          prioritizationFeeLamports: level.fee,
        };

        const response = await swapPage.postSwap(swapRequest);

        // Expected: Transaction includes specified priority fee
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('swapTransaction');
        expect(response.data.swapTransaction).to.be.a('string');
        expect(response.data.swapTransaction).to.not.be.empty;

        // Validate priority fee is reflected in response
        expect(response.data).to.have.property('prioritizationFeeLamports');
        expect(response.data.prioritizationFeeLamports).to.be.a('number');

        // API typically returns requested fee minus 1-2 lamports for compute optimization
        const actualFee = response.data.prioritizationFeeLamports;
        expect(actualFee).to.be.within(
          level.fee - 5,
          level.fee,
          `Priority fee should be close to requested ${level.fee}, got ${actualFee}`
        );

        Logger.info(`${level.name} priority (${level.fee} lamports) -> response fee: ${actualFee}`);
      }
    });

    it('TC-03: Dynamic Compute Limit - Enable dynamic compute unit limit', async () => {
      // First get a fresh quote
      const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quoteResponse.status).to.equal(200);

      // Input: Fresh quote + dynamicComputeUnitLimit: true
      const swapRequest = {
        quoteResponse: quoteResponse.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
        dynamicComputeUnitLimit: true,
      };

      const response = await swapPage.postSwap(swapRequest);

      // Expected: Transaction uses dynamic compute limit instead of max 1,400,000
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('swapTransaction');
      expect(response.data.swapTransaction).to.be.a('string');
      expect(response.data.swapTransaction).to.not.be.empty;

      // Validate compute unit limit
      expect(response.data).to.have.property('computeUnitLimit');
      expect(response.data.computeUnitLimit).to.be.a('number');
      expect(response.data.computeUnitLimit).to.be.greaterThan(0);

      // Dynamic compute limit should be less than the default max of 1,400,000
      expect(response.data.computeUnitLimit).to.be.lessThan(
        1400000,
        'Dynamic compute limit should be optimized to less than max 1,400,000'
      );

      Logger.info(
        `Dynamic compute limit: ${response.data.computeUnitLimit} (optimized from max 1,400,000)`
      );
    });

    it('TC-05: Different Token Pairs - Swap transactions for various token combinations', async () => {
      const tokenPairs = [
        { name: 'SOL → USDC', quoteRequest: SOL_TO_USDC_BASIC, wrapSol: true },
        { name: 'USDC → SOL', quoteRequest: USDC_TO_SOL_REVERSE, wrapSol: true },
        { name: 'Token → Token (USDC → USDT)', quoteRequest: USDC_TO_USDT_STABLE, wrapSol: false },
        { name: 'SOL → USDC (no wrap)', quoteRequest: SOL_TO_USDC_BASIC, wrapSol: false },
      ];

      for (const pair of tokenPairs) {
        // First get a fresh quote for each pair
        const quoteResponse = await quotePage.getQuote(pair.quoteRequest);
        expect(quoteResponse.status).to.equal(200);

        // Input: Fresh quote for different token pair
        const swapRequest = {
          quoteResponse: quoteResponse.data,
          userPublicKey: VALID_USER_PUBLIC_KEY,
          wrapAndUnwrapSol: pair.wrapSol,
        };

        const response = await swapPage.postSwap(swapRequest);

        // Expected: Successful swap transaction for each token pair
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('swapTransaction');
        expect(response.data.swapTransaction).to.be.a('string');
        expect(response.data.swapTransaction).to.not.be.empty;
        expect(response.data.swapTransaction).to.match(
          /^[A-Za-z0-9+/]+=*$/,
          'Should be valid base64'
        );

        // Validate required response fields
        expect(response.data).to.have.property('lastValidBlockHeight');
        expect(response.data.lastValidBlockHeight).to.be.a('number');
        expect(response.data.lastValidBlockHeight).to.be.greaterThan(0);
      }
    });
  });

  describe('Input Validation Tests', () => {
    it('TC-04: Missing Required Fields - Send request without quoteResponse', async () => {
      // Input: Request missing quoteResponse field
      const invalidSwapRequest = {
        userPublicKey: VALID_USER_PUBLIC_KEY,
      };

      const response = await swapPage.postSwap(invalidSwapRequest as any);

      // Expected: 422 Unprocessable Entity with specific error message
      expect(response.status).to.equal(422);
      expect((response.data as any).error).to.include(
        'Failed to deserialize the JSON body into the target type: missing field `quoteResponse`'
      );
    });

    it('TC-06: Invalid User Public Key - Empty userPublicKey', async () => {
      // First get a fresh quote
      const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quoteResponse.status).to.equal(200);

      // Input: Request with empty userPublicKey
      const invalidSwapRequest = {
        quoteResponse: quoteResponse.data,
        userPublicKey: '',
        wrapAndUnwrapSol: true,
      };

      const response = await swapPage.postSwap(invalidSwapRequest);

      // Expected: 422 Unprocessable Entity with WrongSize error
      expect(response.status).to.equal(422);
      expect((response.data as any).error).to.include('userPublicKey: Parse error: WrongSize');
    });

    it('TC-07: Invalid User Public Key - Malformed Solana address', async () => {
      // First get a fresh quote
      const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quoteResponse.status).to.equal(200);

      // Input: Request with malformed Solana address (too short)
      const invalidSwapRequest = {
        quoteResponse: quoteResponse.data,
        userPublicKey: '9WzDXwBbmkg8ZTbN',
        wrapAndUnwrapSol: true,
      };

      const response = await swapPage.postSwap(invalidSwapRequest);

      // Expected: 422 Unprocessable Entity with WrongSize error for short address
      expect(response.status).to.equal(422);
      expect((response.data as any).error).to.include('userPublicKey: Parse error: WrongSize');
    });

    it('TC-08: Invalid User Public Key - Invalid base58 encoding', async () => {
      // First get a fresh quote
      const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quoteResponse.status).to.equal(200);

      // Input: Request with invalid base58 characters (0, O, I, l)
      const invalidSwapRequest = {
        quoteResponse: quoteResponse.data,
        userPublicKey: '0OIl111111111111111111111111111111111111111',
        wrapAndUnwrapSol: true,
      };

      const response = await swapPage.postSwap(invalidSwapRequest);

      // Expected: 422 Unprocessable Entity with Invalid error for bad base58
      expect(response.status).to.equal(422);
      expect((response.data as any).error).to.include('userPublicKey: Parse error: Invalid');
    });

    it('TC-09: Invalid Quote - Negative amount in quote', async () => {
      // First get a fresh quote
      const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quoteResponse.status).to.equal(200);

      // Modify the quote to have negative amount
      const modifiedQuote = {
        ...quoteResponse.data,
        inAmount: '-5', // negative amount
        outAmount: '-5',
      };

      // Input: Request with zero amount quote + dynamic compute limit to trigger simulation
      const swapRequest = {
        quoteResponse: modifiedQuote,
        userPublicKey: VALID_USER_PUBLIC_KEY,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
      };

      const response = await swapPage.postSwap(swapRequest);

      // Expected: Should have simulation error due to zero amount
      expect(response.status).to.equal(422);
      expect((response.data as any).error).to.include(
        'Failed to deserialize the JSON body into the target type: quoteResponse.inAmount'
      );
    });

    it('TC-10: Invalid Quote - Same input and output mint', async () => {
      // First get a fresh quote
      const quoteResponse = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quoteResponse.status).to.equal(200);

      // Modify the quote to have same input and output mint
      const modifiedQuote = {
        ...quoteResponse.data,
        outputMint: quoteResponse.data.inputMint, // Same as input mint
        routePlan: [
          {
            ...quoteResponse.data.routePlan[0],
            swapInfo: {
              ...quoteResponse.data.routePlan[0].swapInfo,
              outputMint: quoteResponse.data.inputMint,
            },
          },
        ],
      };

      // Input: Request with same input/output mint + dynamic compute limit to trigger simulation
      const swapRequest = {
        quoteResponse: modifiedQuote,
        userPublicKey: VALID_USER_PUBLIC_KEY,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
      };

      const response = await swapPage.postSwap(swapRequest);

      // Expected: Should return 400 with CIRCULAR_ARBITRAGE_IS_DISABLED error
      expect(response.status).to.equal(400);
      expect((response.data as any).error).to.equal(
        'Input and output mints are not allowed to be equal'
      );
      expect((response.data as any).errorCode).to.equal('CIRCULAR_ARBITRAGE_IS_DISABLED');
    });
  });

  describe('Large Amount Handling Tests', () => {
    it('TC-12: Million SOL Swap - Test extreme liquidity limits with 1M SOL to USDC', async () => {
      // Test handling of extremely large amounts (1M SOL) that will likely exceed liquidity limits
      // This tests how the API handles requests that are beyond realistic market conditions
      const quoteResponse = await quotePage.getQuote(MILLION_SOL_TO_USDC);
      expect(quoteResponse.status).to.equal(200);

      // Test swap transaction creation with dynamic slippage
      const swapRequest = {
        quoteResponse: quoteResponse.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        dynamicSlippage: { maxBps: 10000 }, // 100% max slippage for extreme amounts
      };

      const swapResponse = await swapPage.postSwap(swapRequest);
      expect(swapResponse.status).to.equal(200);

      // Dynamic slippage report appears for large swaps
      expect(swapResponse.data.dynamicSlippageReport).to.exist;
      expect(swapResponse.data.dynamicSlippageReport.slippageBps).to.be.a('number');

      // Verify that the swap transaction is generated
      expect(swapResponse.data.swapTransaction).to.exist;
      expect(swapResponse.data.swapTransaction).to.be.a('string');
      expect(swapResponse.data.swapTransaction).to.not.be.empty;
    });
  });
});
