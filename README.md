# Jupiter Exchange API Testing Suite

![Tests](https://github.com/Dakatalol/YordanIliev_BlockChainAPI_Challenge/workflows/Test%20Suite/badge.svg)

A simple automated testing project for the **Jupiter Exchange API** on Solana blockchain. This project provides extensive API test coverage for quote generation, swap transaction creation, and large amount handling scenarios.

## Overview

Jupiter is a key DEX aggregator on Solana that finds the best routes for token swaps across multiple liquidity sources. This testing suite validates:

- **Quote API** - Token swap quote generation and validation
- **Swap API** - Transaction creation from quotes with various configurations
- **Large Amount Handling** - Extreme liquidity scenarios and boundary testing
- **Error Handling** - Input validation and edge case coverage
- **Business Logic** - Slippage calculations, route optimization, and fee handling

## Features

- ✅ **Happy Path Testing** - Valid swaps across major token pairs (SOL, USDC, USDT)
- ✅ **Input Validation** - Malformed addresses, invalid amounts, missing parameters
- ✅ **Large Amount Testing** - Multi-million token swaps testing liquidity limits
- ✅ **Dynamic Features** - Priority fees, compute limits, dynamic slippage
- ✅ **Route Analysis** - Multi-hop routing, direct routes, route distribution
- ✅ **Error Scenarios** - Comprehensive negative testing with proper error codes

## Test Coverage

### Quote API Tests (TC-01 to TC-12)

- Valid quote generation for different token pairs
- Slippage calculation verification
- Direct vs multi-hop routing
- Large amount route distribution (1M SOL scenarios)
- Input validation and error handling

### Swap API Tests (TC-01 to TC-12)

- Basic swap transaction generation
- Priority fee levels and compute optimization
- Dynamic slippage for large amounts
- Invalid input handling and edge cases
- Extreme liquidity limit testing

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
JUPITER_BASE_URL=https://lite-api.jup.ag/swap/v1

# Log Level Configuration
LOG_LEVEL=DEBUG
```

### Configuration Options

| Variable           | Description                    | Default Value                     | Options         |
| ------------------ | ------------------------------ | --------------------------------- | --------------- |
| `JUPITER_BASE_URL` | Jupiter API base endpoint      | `https://lite-api.jup.ag/swap/v1` | Any valid URL   |
| `LOG_LEVEL`        | Controls test output verbosity | `DEBUG`                           | `INFO`, `DEBUG` |

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
- **TypeScript** - Type safety and development experience
- **Axios** - HTTP client for API requests
