import { expect } from 'chai';
import { HttpClient } from '../utils/HttpClient';
import { SwapInstructionsPage } from '../pages/SwapInstructionsPage';
import { SwapPage } from '../pages/SwapPage';
import { QuotePage } from '../pages/QuotePage';
import { config } from '../config/environment';
import { VALID_USER_PUBLIC_KEY } from '../constants/constants';
import { Logger } from '../utils/Logger';
import { SwapInstructionsValidators } from '../data/swapInstructionsValidators';
import { SOL_TO_USDC_BASIC, USDC_TO_SOL_REVERSE } from '../data/quoteData';

describe('Jupiter Swap Instructions API Tests', () => {
  let httpClient: HttpClient;
  let swapInstructionsPage: SwapInstructionsPage;
  let swapPage: SwapPage;
  let quotePage: QuotePage;

  before(() => {
    httpClient = new HttpClient(config.JUPITER_BASE_URL, { type: 'none' });
    swapInstructionsPage = new SwapInstructionsPage(httpClient);
    swapPage = new SwapPage(httpClient);
    quotePage = new QuotePage(httpClient);
  });

  describe('Happy Path Scenarios', () => {
    it('TC-01: Basic Instruction Generation - Generate swap instructions with valid quote response', async () => {
      // Get quote for SOL to USDC swap
      const quote = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quote.status).to.equal(200);

      // Input: Fresh quote response + valid userPublicKey
      const swapInstructionsRequest = {
        quoteResponse: quote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
      };

      const response = await swapInstructionsPage.postSwapInstructions(swapInstructionsRequest);

      SwapInstructionsValidators.validateCompleteInstructions(response, swapInstructionsRequest);
    });

    it('TC-02: Setup Instructions Validation - Verify setup instructions contain required programs', async () => {
      // Reuse the same account since both generate setup instructions anyway
      const quote = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quote.status).to.equal(200);

      const swapInstructionsRequest = {
        quoteResponse: quote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
      };

      const response = await swapInstructionsPage.postSwapInstructions(swapInstructionsRequest);

      SwapInstructionsValidators.validateSuccessfulInstructions(response, swapInstructionsRequest);
      SwapInstructionsValidators.validateSetupInstructions(response);
      SwapInstructionsValidators.validateSwapInstruction(response, VALID_USER_PUBLIC_KEY);
    });

    it('TC-03: Cleanup Instructions for SOL Unwrapping - Verify cleanup instructions when unwrapping SOL', async () => {
      // Get quote for USDC to SOL swap
      const usdcToSolQuote = await quotePage.getQuote(USDC_TO_SOL_REVERSE);
      expect(usdcToSolQuote.status).to.equal(200);

      const swapRequest = {
        quoteResponse: usdcToSolQuote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
        wrapAndUnwrapSol: true,
      };

      const response = await swapInstructionsPage.postSwapInstructions(swapRequest);

      SwapInstructionsValidators.validateSuccessfulInstructions(response, swapRequest);
      SwapInstructionsValidators.validateWsolCleanup(response, VALID_USER_PUBLIC_KEY);
    });
  });

  describe('Input Validation Tests', () => {
    it('TC-04: Invalid Quote Response - Send request with empty/invalid quote', async () => {
      const response = await swapInstructionsPage.postSwapInstructions({
        quoteResponse: {}, // Empty/invalid quote
        userPublicKey: VALID_USER_PUBLIC_KEY,
      });

      SwapInstructionsValidators.validateUnprocessableEntity(response, [
        'Failed to deserialize the JSON body into the target type: quoteResponse: missing field `inputMint`',
      ]);
    });

    it('TC-05: Missing User Public Key - Send request without userPublicKey', async () => {
      // First get a valid quote
      const validQuote = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(validQuote.status).to.equal(200);

      const response = await swapInstructionsPage.postSwapInstructions({
        quoteResponse: validQuote.data,
        // Missing userPublicKey
      } as any);

      SwapInstructionsValidators.validateUnprocessableEntity(response, [
        'Failed to deserialize the JSON body into the target type: missing field `userPublicKey`',
      ]);
    });
  });

  describe('Endpoint Comparison Tests', () => {
    it('TC-06: Compare with /swap Endpoint - Compare instruction count and response structure', async () => {
      // Get a fresh quote for both endpoints
      const quote = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quote.status).to.equal(200);

      // Get instructions from swap-instructions endpoint
      const instructions = await swapInstructionsPage.postSwapInstructions({
        quoteResponse: quote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
      });

      // Get transaction from swap endpoint
      const swap = await swapPage.postSwap({
        quoteResponse: quote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
      });

      SwapInstructionsValidators.validateEndpointConsistency(instructions, swap);
    });
  });
});
