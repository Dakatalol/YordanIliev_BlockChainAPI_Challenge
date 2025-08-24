import { QuoteRequest } from '../types/quoteTypes';
import { TOKEN_ADDRESSES, TEST_AMOUNTS, SLIPPAGE_BPS, INVALID_DATA } from '../constants/constants';

// TC-01: Valid Quote for SOL to USDC Swap
export const SOL_TO_USDC_BASIC: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM, // 0.1 SOL
  slippageBps: SLIPPAGE_BPS.LOW,
};

// TC-02: Valid Quote for USDC to SOL Swap (Reverse)
export const USDC_TO_SOL_REVERSE: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.USDC,
  outputMint: TOKEN_ADDRESSES.SOL,
  amount: TEST_AMOUNTS.USDC_MEDIUM, // ~18.39 USDC
  slippageBps: SLIPPAGE_BPS.LOW,
};

// TC-03: Valid Quote for USDC to USDT (Stable Coins)
export const USDC_TO_USDT_STABLE: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.USDC,
  outputMint: TOKEN_ADDRESSES.USDT,
  amount: TEST_AMOUNTS.USDC_LARGE, // 1000 USDC
  slippageBps: SLIPPAGE_BPS.VERY_LOW,
};

// TC-08: Slippage Calculation Verification
export const SLIPPAGE_CALCULATION_TEST: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.MEDIUM, // 100 bps for easy calculation
};

// TC-09: Direct Routes Only
export const DIRECT_ROUTES_ONLY: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
  onlyDirectRoutes: true,
};

// LARGE AMOUNT HANDLING TEST CASE

// TC-12: Million SOL Amount - Test extreme liquidity limits with 1M SOL
export const MILLION_SOL_TO_USDC: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MILLION_SOL, // 1,000,000 SOL
  slippageBps: SLIPPAGE_BPS.VERY_HIGH, // Very high slippage for extreme amounts
};

// NEGATIVE TEST CASES

// TC-04: Missing Required Parameter - inputMint
export const MISSING_INPUT_MINT = {
  // inputMint: undefined, // Will be omitted in test
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

// TC-05: Invalid Token Mint Address Format
export const INVALID_TOKEN_FORMAT: QuoteRequest = {
  inputMint: INVALID_DATA.TOKEN_ADDRESSES.INVALID_FORMAT,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

// TC-06: Zero Amount Validation
export const ZERO_AMOUNT: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.ZERO,
  slippageBps: SLIPPAGE_BPS.LOW,
};

// TC-07: Same Input and Output Mint
export const SAME_INPUT_OUTPUT: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.SOL, // Same as input
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

// TC-10: Non-Existent Token Mint
export const NON_EXISTENT_TOKEN: QuoteRequest = {
  inputMint: INVALID_DATA.TOKEN_ADDRESSES.NON_EXISTENT,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

// Collection of all valid test scenarios
export const VALID_SCENARIOS = {
  SOL_TO_USDC_BASIC,
  USDC_TO_SOL_REVERSE,
  USDC_TO_USDT_STABLE,
  SLIPPAGE_CALCULATION_TEST,
  DIRECT_ROUTES_ONLY,
  // Large amount test scenario
  MILLION_SOL_TO_USDC,
} as const;

// Collection of all invalid test scenarios
export const INVALID_SCENARIOS = {
  MISSING_INPUT_MINT,
  INVALID_TOKEN_FORMAT,
  ZERO_AMOUNT,
  SAME_INPUT_OUTPUT,
  NON_EXISTENT_TOKEN,
} as const;
