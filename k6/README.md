# K6 Performance Tests

Simple performance testing for Jupiter Quote API using K6.

**⚠️ WARNING:** The Jupiter Lite API has a rate limit of 60 requests per minute (1 request/second). Running the default performance test will result in ~83% of requests being rate-limited. This is expected behavior when testing with the free tier API.

## Installation

Install K6 (required before running performance tests):

### Windows
```bash
# Using Windows Package Manager
winget install k6 --source winget

# Using Chocolatey
choco install k6
```

### macOS
```bash
brew install k6
```

## Configuration

The test uses the same environment variable as the main test suite:

```bash
export JUPITER_BASE_URL=https://lite-api.jup.ag
```

## Running Tests

### Default Test (10 VUs for 30s)
```bash
npm run perf:quote
```

### Custom Configuration
```bash
# 5 virtual users for 1 minute
k6 run --vus 5 --duration 1m k6/quote-performance.js

# 20 virtual users for 2 minutes
k6 run --vus 20 --duration 2m k6/quote-performance.js
```

## Test Scenario

The performance test covers a single quote scenario:
- SOL → USDC (0.1 SOL with 50 bps slippage)

## Thresholds

- 95% of requests should complete under 2 seconds
- Less than 5% error rate