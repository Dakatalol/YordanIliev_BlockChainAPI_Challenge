import { expect } from 'chai';
import { HttpClient } from '../utils/HttpClient';
import { SwapInstructionsPage } from '../pages/SwapInstructionsPage';
import { QuotePage } from '../pages/QuotePage';
import { config } from '../config/environment';
import { VALID_USER_PUBLIC_KEY } from '../constants/constants';
import { Logger } from '../utils/Logger';
import { SOL_TO_USDC_BASIC, USDC_TO_SOL_REVERSE } from '../data/quoteData';

describe('Jupiter Swap Instructions API Tests', () => {
  let httpClient: HttpClient;
  let swapInstructionsPage: SwapInstructionsPage;
  let quotePage: QuotePage;

  before(() => {
    httpClient = new HttpClient(config.JUPITER_BASE_URL, { type: 'none' });
    swapInstructionsPage = new SwapInstructionsPage(httpClient);
    quotePage = new QuotePage(httpClient);
  });

  describe('Happy Path Scenarios', () => {
    
    it('TC-01: Basic Instruction Generation - Generate swap instructions with valid quote response', async () => {
      // First get a fresh quote using SOL_TO_USDC_BASIC parameters
      const quote = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quote.status).to.equal(200);
      
      // Input: Fresh quote response + valid userPublicKey
      const swapInstructionsRequest = {
        quoteResponse: quote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY
      };
      
      const response = await swapInstructionsPage.postSwapInstructions(swapInstructionsRequest);
      expect(response.status).to.equal(200);
      
      // Validate main instruction categories
      expect(response.data).to.have.property('computeBudgetInstructions');
      expect(response.data.computeBudgetInstructions).to.be.an('array');
      
      expect(response.data).to.have.property('setupInstructions');
      expect(response.data.setupInstructions).to.be.an('array');
      
      expect(response.data).to.have.property('swapInstruction');
      expect(response.data.swapInstruction).to.be.an('object');
      
      expect(response.data).to.have.property('cleanupInstruction');
      expect(response.data.cleanupInstruction).to.be.an('object');
      
      // Validate compute budget instruction (first one should be for compute unit limit)
      const computeBudgetInstruction = response.data.computeBudgetInstructions[0];
      expect(computeBudgetInstruction.programId).to.equal('ComputeBudget111111111111111111111111111111');
      expect(computeBudgetInstruction.data).to.match(/^[A-Za-z0-9+/]+=*$/, 'Should be valid base64');
      
      // Validate main swap instruction - should be Jupiter's program
      expect(response.data.swapInstruction.programId).to.equal('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4');
      expect(response.data.swapInstruction.data).to.match(/^[A-Za-z0-9+/]+=*$/, 'Should be valid base64');
      
      // Validate that user's public key is included in swap instruction accounts
      const userAccountExists = response.data.swapInstruction.accounts.some(
        account => account.pubkey === VALID_USER_PUBLIC_KEY
      );
      expect(userAccountExists).to.be.true;
      
      // Validate cleanup instruction (should be Token program for closing accounts)
      expect(response.data.cleanupInstruction.programId).to.equal('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      
      // Validate response metadata
      expect(response.data).to.have.property('prioritizationFeeLamports');
      expect(response.data.prioritizationFeeLamports).to.be.a('number');
      
      expect(response.data).to.have.property('computeUnitLimit');
      expect(response.data.computeUnitLimit).to.be.a('number');
      expect(response.data.computeUnitLimit).to.be.greaterThan(0);
      
      // Validate account structure for first account in swap instruction
      const firstAccount = response.data.swapInstruction.accounts[0];
      expect(firstAccount).to.have.property('pubkey');
      expect(firstAccount.pubkey).to.have.length.greaterThan(32);
    });

    it('TC-02: Setup Instructions Validation - Verify setup instructions contain required programs', async () => {
      // Reuse the same account since both generate setup instructions anyway
      const quote = await quotePage.getQuote(SOL_TO_USDC_BASIC);
      expect(quote.status).to.equal(200);
      
      const swapInstructionsRequest = {
        quoteResponse: quote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY
      };
      
      const response = await swapInstructionsPage.postSwapInstructions(swapInstructionsRequest);
      
      // Expected: 200 OK with setup instructions
      expect(response.status).to.equal(200);
      
      // Should include System Program (for account creation)
      const programIds = response.data.setupInstructions.map(instruction => instruction.programId);
      expect(programIds).to.include('11111111111111111111111111111111');
      
      // Should include Token Program (for token operations)  
      expect(programIds).to.include('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      
      // Should include Jupiter Program (for swap operations)
      expect(response.data.swapInstruction.programId).to.equal('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4');  
    });

    it('TC-03: Cleanup Instructions for SOL Unwrapping - Verify cleanup instructions when unwrapping SOL', async () => {
      // Get quote for USDC to SOL swap 
      const usdcToSolQuote = await quotePage.getQuote(USDC_TO_SOL_REVERSE);
      expect(usdcToSolQuote.status).to.equal(200);
      
      const response = await swapInstructionsPage.postSwapInstructions({
        quoteResponse: usdcToSolQuote.data,
        userPublicKey: VALID_USER_PUBLIC_KEY,
        wrapAndUnwrapSol: true
      });
      
      // Expected: 200 OK with cleanup instructions for SOL unwrapping
      expect(response.status).to.equal(200);
      expect(response.data.cleanupInstruction).to.exist;
      // Should close wSOL account after swap
      
      // Cleanup instruction should be Token Program for closing wSOL account
      expect(response.data.cleanupInstruction.programId).to.equal('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      
      // User should be signer for closing their wSOL account
      const userAsSigner = response.data.cleanupInstruction.accounts.some(
        account => account.pubkey === VALID_USER_PUBLIC_KEY && account.isSigner === true
      );
      expect(userAsSigner).to.be.true;
      
      // Should have multiple accounts involved in cleanup (user's wSOL token account, user, etc.)
      expect(response.data.cleanupInstruction.accounts.length).to.be.greaterThan(1);
    });

  });

});