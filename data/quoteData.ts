import { QuoteRequest } from '../types/quoteTypes';
import { TOKEN_ADDRESSES, TEST_AMOUNTS, SLIPPAGE_BPS, INVALID_DATA } from '../constants/constants';

export const SOL_TO_USDC_BASIC: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

export const USDC_TO_SOL_REVERSE: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.USDC,
  outputMint: TOKEN_ADDRESSES.SOL,
  amount: TEST_AMOUNTS.USDC_MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

export const USDC_TO_USDT_STABLE: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.USDC,
  outputMint: TOKEN_ADDRESSES.USDT,
  amount: TEST_AMOUNTS.USDC_LARGE,
  slippageBps: SLIPPAGE_BPS.VERY_LOW,
};

export const SLIPPAGE_CALCULATION_TEST: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.MEDIUM,
};

export const DIRECT_ROUTES_ONLY: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
  onlyDirectRoutes: true,
};

export const MILLION_SOL_TO_USDC: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MILLION_SOL,
  slippageBps: SLIPPAGE_BPS.VERY_HIGH,
};

export const MISSING_INPUT_MINT = {
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

export const INVALID_TOKEN_FORMAT: QuoteRequest = {
  inputMint: INVALID_DATA.TOKEN_ADDRESSES.INVALID_FORMAT,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

export const ZERO_AMOUNT: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.ZERO,
  slippageBps: SLIPPAGE_BPS.LOW,
};

export const SAME_INPUT_OUTPUT: QuoteRequest = {
  inputMint: TOKEN_ADDRESSES.SOL,
  outputMint: TOKEN_ADDRESSES.SOL,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

export const NON_EXISTENT_TOKEN: QuoteRequest = {
  inputMint: INVALID_DATA.TOKEN_ADDRESSES.NON_EXISTENT,
  outputMint: TOKEN_ADDRESSES.USDC,
  amount: TEST_AMOUNTS.MEDIUM,
  slippageBps: SLIPPAGE_BPS.LOW,
};

export const VALID_SCENARIOS = {
  SOL_TO_USDC_BASIC,
  USDC_TO_SOL_REVERSE,
  USDC_TO_USDT_STABLE,
  SLIPPAGE_CALCULATION_TEST,
  DIRECT_ROUTES_ONLY,
  MILLION_SOL_TO_USDC,
} as const;

export const INVALID_SCENARIOS = {
  MISSING_INPUT_MINT,
  INVALID_TOKEN_FORMAT,
  ZERO_AMOUNT,
  SAME_INPUT_OUTPUT,
  NON_EXISTENT_TOKEN,
} as const;
