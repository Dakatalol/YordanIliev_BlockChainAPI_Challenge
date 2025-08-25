import http from 'k6/http';
import { check } from 'k6';

// Test configuration
export let options = {
  vus: 10,        // 10 virtual users
  duration: '30s', // Run for 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.05'],    // Less than 5% errors
  },
};

// Constants for SOL to USDC quote
const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';
const USDC_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const AMOUNT = '100000000'; // 0.1 SOL
const SLIPPAGE = 50;

// Base URL
const BASE_URL = __ENV.JUPITER_BASE_URL || 'https://lite-api.jup.ag';

export default function () {
  // Single scenario: SOL to USDC
  const queryParams = [
    `inputMint=${SOL_ADDRESS}`,
    `outputMint=${USDC_ADDRESS}`,
    `amount=${AMOUNT}`,
    `slippageBps=${SLIPPAGE}`
  ];
  
  const url = `${BASE_URL}/swap/v1/quote?${queryParams.join('&')}`;
  
  // Make request
  const response = http.get(url);
  
  // Basic checks
  check(response, {
    'status is 200': (r) => r.status === 200,
    'has quote data': (r) => r.json('outAmount') !== undefined
  });
}