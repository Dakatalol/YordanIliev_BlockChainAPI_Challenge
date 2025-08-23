import { expect } from 'chai';
import { QuoteRequest, QuoteResponse } from '../types/quoteTypes';
import { EXPECTED_RANGES, HTTP_STATUS } from '../constants/constants';
import { Logger } from '../utils/Logger';

export class QuoteValidators {
  
  // Basic successful response validation
  static validateSuccessfulQuote(response: any, request: QuoteRequest): void {
    expect(response.status).to.equal(HTTP_STATUS.OK);
    expect(response.data).to.have.property('inputMint', request.inputMint);
    expect(response.data).to.have.property('outputMint', request.outputMint);
    expect(response.data).to.have.property('inAmount', request.amount);
    expect(response.data).to.have.property('outAmount');
    expect(response.data).to.have.property('routePlan');
    expect(response.data).to.have.property('slippageBps', request.slippageBps);
    
    // Data type validations
    expect(response.data.outAmount).to.be.a('string');
    expect(parseInt(response.data.outAmount)).to.be.greaterThan(0);
    expect(response.data.routePlan).to.be.an('array');
    expect(response.data.routePlan.length).to.be.greaterThan(0);
  }

  // Validation for stablecoin swaps (should have minimal price impact)
  static validateStablecoinSwap(response: any, request: QuoteRequest): void {
    this.validateSuccessfulQuote(response, request);
    
    const inputAmount = parseInt(request.amount);
    const outputAmount = parseInt(response.data.outAmount);
    const ratio = outputAmount / inputAmount;
    
    expect(ratio).to.be.within(
      EXPECTED_RANGES.STABLECOIN_RATIO.MIN, 
      EXPECTED_RANGES.STABLECOIN_RATIO.MAX,
      `Stablecoin ratio ${ratio} outside expected range`
    );
    
    // Price impact should be minimal for stablecoins
    const priceImpact = parseFloat(response.data.priceImpactPct);
    expect(priceImpact).to.be.lessThan(0.5, 'Price impact too high for stablecoin swap');
  }

  // Validation for slippage calculation
  static validateSlippageCalculation(response: any, request: QuoteRequest): void {
    this.validateSuccessfulQuote(response, request);
    
    const outAmount = parseInt(response.data.outAmount);
    const otherAmountThreshold = parseInt(response.data.otherAmountThreshold);
    const slippageBps = request.slippageBps;
    
    // Calculate expected threshold: outAmount - (outAmount * slippageBps / 10000)
    const expectedThreshold = Math.floor(outAmount - (outAmount * slippageBps / 10000));
    
    // Allow for 1 unit difference due to rounding
    const difference = Math.abs(otherAmountThreshold - expectedThreshold);
    expect(difference).to.be.lessThanOrEqual(1, 
      `Slippage calculation too far off. Expected: ${expectedThreshold}, Got: ${otherAmountThreshold}, Difference: ${difference}`
    );
  }

  // Validation for direct routes only
  static validateDirectRoutesOnly(response: any, request: QuoteRequest): void {
    this.validateSuccessfulQuote(response, request);
    
    expect(response.data.routePlan).to.have.length(1, 'Should have exactly 1 route for direct swap');
    
    const route = response.data.routePlan[0];
    expect(route.swapInfo.inputMint).to.equal(request.inputMint);
    expect(route.swapInfo.outputMint).to.equal(request.outputMint);
  }

  // Validation for restricted vs unrestricted intermediate tokens
  static validateIntermediateTokenRestriction(
    restrictedResponse: any, 
    unrestrictedResponse: any, 
    request: QuoteRequest
  ): void {
    this.validateSuccessfulQuote(restrictedResponse, request);
    this.validateSuccessfulQuote(unrestrictedResponse, request);
    
    // Both should be successful, but routes might differ
    // This is more of a comparison test to ensure the parameter works
    Logger.debug(`Restricted routes: ${restrictedResponse.data.routePlan.length}`);
    Logger.debug(`Unrestricted routes: ${unrestrictedResponse.data.routePlan.length}`);
  }

  // Validation for error responses with optional error code validation
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
        expect(errorMessage).to.include(keyword.toLowerCase(), 
          `Error message should contain "${keyword}"`
        );
      });
    }

    // Validate specific error code if provided
    if (expectedErrorCode) {
      expect(response.data).to.have.property('errorCode', expectedErrorCode);
    }
  }

  // Validation for 400 Bad Request responses with error code support
  static validateBadRequest(
    errorOrResponse: any, 
    expectedErrorKeywords: string[] = [], 
    expectedErrorCode?: string
  ): void {
    this.validateErrorResponse(errorOrResponse, HTTP_STATUS.BAD_REQUEST, expectedErrorKeywords, expectedErrorCode);
  }

}
