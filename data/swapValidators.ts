import { expect } from 'chai';
import { SwapRequest } from '../types/swapTypes';
import { HTTP_STATUS } from '../constants/constants';

export class SwapValidators {
  // Basic successful swap response validation
  static validateSuccessfulSwap(response: any, request: SwapRequest): void {
    expect(response.status).to.equal(HTTP_STATUS.OK);

    // Validate core swap transaction fields
    expect(response.data).to.have.property('swapTransaction');
    expect(response.data.swapTransaction).to.be.a('string');
    expect(response.data.swapTransaction).to.not.be.empty;
    expect(response.data.swapTransaction).to.match(/^[A-Za-z0-9+/]+=*$/, 'Should be valid base64');

    // Validate block height
    expect(response.data).to.have.property('lastValidBlockHeight');
    expect(response.data.lastValidBlockHeight).to.be.a('number');
    expect(response.data.lastValidBlockHeight).to.be.greaterThan(0);
  }

  // Priority fee validation with range checking
  static validatePriorityFee(response: any, expectedFee: number): void {
    this.validateSuccessfulSwap(response, {} as SwapRequest);

    expect(response.data).to.have.property('prioritizationFeeLamports');
    expect(response.data.prioritizationFeeLamports).to.be.a('number');

    // API typically returns requested fee minus 1-2 lamports for compute optimization
    // We take off 5 lamports for deviation
    const actualFee = response.data.prioritizationFeeLamports;
    expect(actualFee).to.be.within(
      expectedFee - 5,
      expectedFee,
      `Priority fee should be close to requested ${expectedFee}, got ${actualFee}`
    );
  }

  // Dynamic compute limit validation
  static validateDynamicComputeLimit(response: any): void {
    this.validateSuccessfulSwap(response, {} as SwapRequest);

    expect(response.data).to.have.property('computeUnitLimit');
    expect(response.data.computeUnitLimit).to.be.a('number');
    expect(response.data.computeUnitLimit).to.be.greaterThan(0);

    // Dynamic compute limit should be less than the default max of 1,400,000
    expect(response.data.computeUnitLimit).to.be.lessThan(
      1400000,
      'Dynamic compute limit should be optimized to less than max 1,400,000'
    );
  }

  // Dynamic slippage validation for large amounts
  static validateDynamicSlippage(response: any): void {
    this.validateSuccessfulSwap(response, {} as SwapRequest);

    expect(response.data.dynamicSlippageReport).to.exist;
    expect(response.data.dynamicSlippageReport.slippageBps).to.be.a('number');
  }

  // Error response validation
  static validateErrorResponse(
    errorOrResponse: any,
    expectedStatus: number,
    expectedErrorKeywords: string[] = [],
    expectedErrorCode?: string
  ): void {
    // Handle axios error or direct response
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

    // Validate specific error code if provided
    if (expectedErrorCode) {
      expect(response.data).to.have.property('errorCode', expectedErrorCode);
    }
  }

  // 422 Unprocessable Entity validation
  static validateUnprocessableEntity(
    errorOrResponse: any,
    expectedErrorKeywords: string[] = []
  ): void {
    this.validateErrorResponse(errorOrResponse, 422, expectedErrorKeywords);
  }

  // 400 Bad Request validation
  static validateBadRequest(
    errorOrResponse: any,
    expectedErrorKeywords: string[] = [],
    expectedErrorCode?: string
  ): void {
    this.validateErrorResponse(
      errorOrResponse,
      HTTP_STATUS.BAD_REQUEST,
      expectedErrorKeywords,
      expectedErrorCode
    );
  }
}
