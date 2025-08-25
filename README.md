# Jupiter Exchange API Testing Suite

![Tests](https://github.com/Dakatalol/YordanIliev_BlockChainAPI_Challenge/workflows/Test%20Suite/badge.svg)

Comprehensive automated testing for Jupiter Exchange APIs on Solana. Covers quotes, swaps, instructions, tokens, and pricing.

## Overview

Jupiter is a key DEX aggregator on Solana that finds the best routes for token swaps across multiple liquidity sources. This testing suite validates:

- **Quote API** - Token swap quote generation and validation
- **Swap API** - Transaction creation from quotes with various configurations
- **Swap Instructions API** - Instruction generation for custom transaction handling
- **Token API** - Token search by mint, symbol, name, and tag filtering
- **Price API** - Real-time token price retrieval and validation
- **Large Amount Handling** - Extreme liquidity scenarios and boundary testing
- **Error Handling** - Input validation and edge case coverage
- **Business Logic** - Slippage calculations, route optimization, and fee handling

## Features

- **Happy Path Testing** - Valid swaps across major token pairs (SOL, USDC, USDT)
- **Input Validation** - Malformed addresses, invalid amounts, missing parameters
- **Large Amount Testing** - Multi-million token swaps testing liquidity limits
- **Dynamic Features** - Priority fees, compute limits, dynamic slippage
- **Route Analysis** - Multi-hop routing, direct routes, route distribution
- **Token Operations** - Search by mint/symbol/name, tag filtering (verified/lst)
- **Price Validation** - Real-time pricing, stablecoin validation, batch requests
- **Error Scenarios** - Comprehensive negative testing with proper error codes

## Test Coverage

### Quote API Tests (TC-01 to TC-13)

- Valid quote generation for different token pairs
- Slippage calculation verification
- Direct vs multi-hop routing
- Large amount route distribution (1M SOL scenarios)
- Input validation and error handling
- Response schema validation

### Swap API Tests (TC-01 to TC-12)

- Basic swap transaction generation
- Priority fee levels and compute optimization
- Dynamic slippage for large amounts
- Invalid input handling and edge cases
- Extreme liquidity limit testing

### Swap Instructions API Tests (TC-01 to TC-06)

- Basic instruction generation from quotes
- Setup and cleanup instruction validation
- SOL wrapping/unwrapping scenarios
- Input validation and error handling
- Endpoint comparison with /swap API

### Token API Tests (TC-01 to TC-10)

- Token search by mint address, symbol, and name
- Multiple token retrieval and limits
- Tag-based filtering (verified, lst tokens)
- Invalid input and empty query handling

### Price API Tests (TC-01 to TC-07)

- Single and multiple token price retrieval
- Stablecoin price validation (USDC/USDT)
- Price consistency across request types
- Invalid token and rate limiting handling
- Token ID deduplication behavior

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

### Environment Setup

The project requires a `.env` file for API configuration. Create it in the project root:

**Step 1:** Copy the example file

```bash
cp example.env .env
```

**Step 2:** Configure the Jupiter API endpoint and logging in your `.env` file:

```env
# Jupiter API Configuration
JUPITER_BASE_URL=https://lite-api.jup.ag

# Log Level Configuration
LOG_LEVEL=DEBUG
```

### Configuration Options

| Variable           | Description                    | Default Value             | Options         |
| ------------------ | ------------------------------ | ------------------------- | --------------- |
| `JUPITER_BASE_URL` | Jupiter API base endpoint      | `https://lite-api.jup.ag` | Any valid URL   |
| `LOG_LEVEL`        | Controls test output verbosity | `DEBUG`                   | `INFO`, `DEBUG` |

### Log Levels

- **INFO**: Shows only test results (clean output)

  ```
  Jupiter Quote API Tests
    Happy Path Tests
  ✔ TC-01: Should get valid quote for SOL to USDC swap (336ms)
  ```

- **DEBUG**: Shows detailed request/response information + test results
  ```
  GET /v6/quote?inputMint=So11111111...
  Response: 200
  Response Data:
  {
    "inputMint": "So11111111...",
    "outAmount": "18450000"
  }
  ✔ TC-01: Should get valid quote for SOL to USDC swap (336ms)
  ```

> **Note:** The `.env` file is optional. If not provided, the project will use default values.

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Individual Test Suites

```bash
# Quote API tests only
npm run test:quote

# Swap API tests only
npm run test:swap

# Swap Instructions API tests only
npm run test:swap-instructions

# Token API tests only
npm run test:token

# Price API tests only
npm run test:price
```

## Test Results

Tests validate API responses against:

- HTTP status codes and error messages
- Response schema compliance
- Business logic correctness
- Performance characteristics
- Boundary condition handling

Each test case includes detailed assertions and logging for analysis and debugging.

## Continuous Integration

The project includes GitHub Actions workflow that automatically runs tests on:

- Every push to `main` or `develop` branches
- Every pull request to `main` or `develop` branches
- Node.js 20 environment

Check the **Actions** tab in GitHub to see test results and build status.

## Dependencies

- **Mocha + Chai** - Test framework and assertions
- **TypeScript** - Prefered for Type safety
- **Axios** - HTTP client for API requests
