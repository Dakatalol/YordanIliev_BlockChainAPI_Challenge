import { expect } from 'chai';
import { SwapInstructionsRequest } from '../types/swapInstructionsTypes';
import { HTTP_STATUS } from '../constants/constants';

export class SwapInstructionsValidators {
  // Solana program IDs
  static readonly PROGRAM_IDS = {
    COMPUTE_BUDGET: 'ComputeBudget111111111111111111111111111111',
    JUPITER: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    TOKEN: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    SYSTEM: '11111111111111111111111111111111',
  };

  // Basic successful swap instructions response validation
  static validateSuccessfulInstructions(response: any, request: SwapInstructionsRequest): void {
    expect(response.status).to.equal(HTTP_STATUS.OK);

    // Validate main instruction categories
    expect(response.data).to.have.property('computeBudgetInstructions');
    expect(response.data.computeBudgetInstructions).to.be.an('array');

    expect(response.data).to.have.property('setupInstructions');
    expect(response.data.setupInstructions).to.be.an('array');

    expect(response.data).to.have.property('swapInstruction');
    expect(response.data.swapInstruction).to.be.an('object');

    expect(response.data).to.have.property('cleanupInstruction');
    expect(response.data.cleanupInstruction).to.be.an('object');

    // Validate response metadata
    expect(response.data).to.have.property('prioritizationFeeLamports');
    expect(response.data.prioritizationFeeLamports).to.be.a('number');

    expect(response.data).to.have.property('computeUnitLimit');
    expect(response.data.computeUnitLimit).to.be.a('number');
    expect(response.data.computeUnitLimit).to.be.greaterThan(0);
  }

  // Validate compute budget instructions
  static validateComputeBudgetInstructions(response: any): void {
    const computeBudgetInstruction = response.data.computeBudgetInstructions[0];
    expect(computeBudgetInstruction.programId).to.equal(this.PROGRAM_IDS.COMPUTE_BUDGET);
    expect(computeBudgetInstruction.data).to.match(
      /^[A-Za-z0-9+/]+=*$/,
      'Should be valid base64'
    );
  }

  // Validate main swap instruction
  static validateSwapInstruction(response: any, userPublicKey: string): void {
    // Validate Jupiter program ID
    expect(response.data.swapInstruction.programId).to.equal(this.PROGRAM_IDS.JUPITER);
    
    // Validate base64 instruction data
    expect(response.data.swapInstruction.data).to.match(
      /^[A-Za-z0-9+/]+=*$/,
      'Should be valid base64'
    );

    // Validate user account presence
    const userAccountExists = response.data.swapInstruction.accounts.some(
      (account: any) => account.pubkey === userPublicKey
    );
    expect(userAccountExists).to.be.true;

    // Validate account structure
    const firstAccount = response.data.swapInstruction.accounts[0];
    expect(firstAccount).to.have.property('pubkey');
    expect(firstAccount.pubkey).to.have.length.greaterThan(32);
  }

  // Validate cleanup instruction
  static validateCleanupInstruction(response: any): void {
    expect(response.data.cleanupInstruction.programId).to.equal(this.PROGRAM_IDS.TOKEN);
  }

  // Validate setup instructions contain required programs
  static validateSetupInstructions(response: any): void {
    const programIds = response.data.setupInstructions.map((instruction: any) => instruction.programId);
    
    // Should include System Program (for account creation)
    expect(programIds).to.include(this.PROGRAM_IDS.SYSTEM);
    
    // Should include Token Program (for token operations)
    expect(programIds).to.include(this.PROGRAM_IDS.TOKEN);
  }

  // Validate wSOL cleanup with user as signer
  static validateWsolCleanup(response: any, userPublicKey: string): void {
    expect(response.data.cleanupInstruction).to.exist;
    
    // Cleanup instruction should be Token Program
    expect(response.data.cleanupInstruction.programId).to.equal(this.PROGRAM_IDS.TOKEN);

    // User should be signer for closing their wSOL account
    const userAsSigner = response.data.cleanupInstruction.accounts.some(
      (account: any) => account.pubkey === userPublicKey && account.isSigner === true
    );
    expect(userAsSigner).to.be.true;

    // Should have multiple accounts involved in cleanup
    expect(response.data.cleanupInstruction.accounts.length).to.be.greaterThan(1);
  }

  // Comprehensive validation combining all checks
  static validateCompleteInstructions(response: any, request: SwapInstructionsRequest): void {
    this.validateSuccessfulInstructions(response, request);
    this.validateComputeBudgetInstructions(response);
    this.validateSwapInstruction(response, request.userPublicKey);
    this.validateCleanupInstruction(response);
  }

  // Cross-endpoint consistency validation
  static validateEndpointConsistency(instructionsResponse: any, swapResponse: any): void {
    expect(instructionsResponse.status).to.equal(HTTP_STATUS.OK);
    expect(swapResponse.status).to.equal(HTTP_STATUS.OK);

    // Compare consistent fields between endpoints
    expect(instructionsResponse.data.computeUnitLimit).to.equal(swapResponse.data.computeUnitLimit);
    expect(instructionsResponse.data.prioritizationFeeLamports).to.equal(
      swapResponse.data.prioritizationFeeLamports
    );
  }

  // Error response validation
  static validateErrorResponse(
    errorOrResponse: any,
    expectedStatus: number,
    expectedErrorKeywords: string[] = []
  ): void {
    const response = errorOrResponse.response || errorOrResponse;

    expect(response.status).to.equal(expectedStatus);

    if (expectedErrorKeywords.length > 0) {
      const errorMessage = JSON.stringify(response.data).toLowerCase();
      expectedErrorKeywords.forEach(keyword => {
        expect(errorMessage).to.include(
          keyword.toLowerCase(),
          `Error message should contain "${keyword}"`
        );
      });
    }
  }

  // 422 Unprocessable Entity validation
  static validateUnprocessableEntity(
    errorOrResponse: any,
    expectedErrorKeywords: string[] = []
  ): void {
    this.validateErrorResponse(errorOrResponse, 422, expectedErrorKeywords);
  }
}