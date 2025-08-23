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


## Configuration

Create a `.env` file in the root directory. Check example.env.
JUPITER_BASE_URL=https://quote-api.jup.ag


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
