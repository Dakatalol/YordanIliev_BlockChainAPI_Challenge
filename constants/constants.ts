// Token addresses for testing
export const TOKEN_ADDRESSES = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
} as const;

// Standard amounts for testing (in smallest units)
export const TEST_AMOUNTS = {
  SMALL: '10000000', // 0.01 SOL
  MEDIUM: '100000000', // 0.1 SOL
  LARGE: '1000000000', // 1 SOL
  USDC_SMALL: '1000000', // 1 USDC (6 decimals)
  USDC_MEDIUM: '18388092', // ~18.39 USDC
  USDC_LARGE: '1000000000', // 1000 USDC
  // Very large amounts for liquidity limit testing
  MILLION_SOL: '1000000000000000', // 1,000,000 SOL (1M SOL)
  ZERO: '0',
  NEGATIVE: '-100000000',
} as const;

// Slippage values in basis points
export const SLIPPAGE_BPS = {
  VERY_LOW: 10, // 0.1%
  LOW: 50, // 0.5%
  MEDIUM: 100, // 1%
  HIGH: 300, // 3%
  VERY_HIGH: 1000, // 10%
  NEGATIVE: -10,
} as const;

// Invalid test data
export const INVALID_DATA = {
  TOKEN_ADDRESSES: {
    INVALID_FORMAT: 'invalid_address_123',
    NON_EXISTENT: '1111111111111111111111111111111111111111111', // Valid format, non-existent
    EMPTY: '',
    NULL: null as any,
  },
} as const;

// Expected ranges for different swap types
export const EXPECTED_RANGES = {
  STABLECOIN_RATIO: {
    MIN: 0.995, // 0.5% deviation
    MAX: 1.005,
  },
  SOL_USDC_APPROXIMATE: {
    MIN_USDC_PER_SOL: 15, // Rough estimates - adjust based on market
    MAX_USDC_PER_SOL: 25,
  },
} as const;

// API response status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Jupiter API error codes
export const JUPITER_ERROR_CODES = {
  COULD_NOT_FIND_ANY_ROUTE: 'COULD_NOT_FIND_ANY_ROUTE',
  CIRCULAR_ARBITRAGE_IS_DISABLED: 'CIRCULAR_ARBITRAGE_IS_DISABLED',
} as const;

// Priority fee levels for testing (in lamports)
export const PRIORITY_FEES = {
  LOW: 1000, // 1000 lamports
  MEDIUM: 5000, // 5000 lamports
  HIGH: 10000, // 10000 lamports
  VERY_HIGH: 50000, // 50000 lamports
} as const;

// Valid user public key for testing (example Solana address)
export const VALID_USER_PUBLIC_KEY = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
