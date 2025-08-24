import { expect } from 'chai';
import { HttpClient } from '../utils/HttpClient';
import { PricePage } from '../pages/PricePage';
import { config } from '../config/environment';
import { TOKEN_ADDRESSES } from '../constants/constants';

describe('Jupiter Price API Tests', () => {
  let httpClient: HttpClient;
  let pricePage: PricePage;

  before(() => {
    httpClient = new HttpClient(config.JUPITER_BASE_URL);
    pricePage = new PricePage(httpClient);
  });

  describe('Price Retrieval Tests', () => {
    it('TC-01: Should get price for single token (SOL)', async () => {
      const response = await pricePage.getPrices({
        ids: [TOKEN_ADDRESSES.SOL],
      });

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property(TOKEN_ADDRESSES.SOL);

      const solPrice = response.data[TOKEN_ADDRESSES.SOL];
      expect(solPrice).to.have.property('usdPrice');
      expect(solPrice).to.have.property('blockId');
      expect(solPrice).to.have.property('decimals');
      expect(solPrice).to.have.property('priceChange24h');

      expect(solPrice.usdPrice).to.be.a('number');
      expect(solPrice.usdPrice).to.be.greaterThan(0);
      expect(solPrice.blockId).to.be.a('number');
      expect(solPrice.decimals).to.equal(9);
      expect(solPrice.priceChange24h).to.be.a('number');
    });

    it('TC-02: Should get prices for multiple tokens', async () => {
      const response = await pricePage.getPrices({
        ids: [TOKEN_ADDRESSES.SOL, TOKEN_ADDRESSES.USDC, TOKEN_ADDRESSES.USDT],
      });

      expect(response.status).to.equal(200);
      expect(Object.keys(response.data)).to.have.length(3);

      [TOKEN_ADDRESSES.SOL, TOKEN_ADDRESSES.USDC, TOKEN_ADDRESSES.USDT].forEach(tokenId => {
        expect(response.data).to.have.property(tokenId);
        const tokenPrice = response.data[tokenId];
        expect(tokenPrice.usdPrice).to.be.a('number');
        expect(tokenPrice.usdPrice).to.be.greaterThan(0);
        expect(tokenPrice.blockId).to.be.a('number');
        expect(tokenPrice.decimals).to.be.a('number');
        expect(tokenPrice.priceChange24h).to.be.a('number');
      });
    });

    it('TC-03: Should validate USDC price is close to $1', async () => {
      const response = await pricePage.getPrices({
        ids: [TOKEN_ADDRESSES.USDC],
      });

      expect(response.status).to.equal(200);
      const usdcPrice = response.data[TOKEN_ADDRESSES.USDC];

      expect(usdcPrice.usdPrice).to.be.approximately(1.0, 0.1);
      expect(usdcPrice.decimals).to.equal(6);
    });

    it('TC-04: Should compare SOL price consistency across single and batch requests', async () => {
      const singleResponse = await pricePage.getPrices({
        ids: [TOKEN_ADDRESSES.SOL],
      });

      const batchResponse = await pricePage.getPrices({
        ids: [TOKEN_ADDRESSES.SOL, TOKEN_ADDRESSES.USDC],
      });

      expect(singleResponse.status).to.equal(200);
      expect(batchResponse.status).to.equal(200);

      const singleSolPrice = singleResponse.data[TOKEN_ADDRESSES.SOL].usdPrice;
      const batchSolPrice = batchResponse.data[TOKEN_ADDRESSES.SOL].usdPrice;

      expect(singleSolPrice).to.be.approximately(batchSolPrice, 0.1);
    });
  });

  describe('Input Validation Tests', () => {
    it('TC-05: Should handle invalid token mint address', async () => {
      const response = await pricePage.getPrices({
        ids: ['InvalidTokenMint123'],
      });

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('object');
      expect(Object.keys(response.data)).to.have.length(0);
    });

    it('TC-06: Should handle empty token IDs array', async () => {
      const response = await pricePage.getPrices({
        ids: [],
      });

      expect(response.status).to.equal(400);
      expect(response.data).to.have.property('status', 400);
    });

    it('TC-07: Should deduplicate identical token IDs in large requests', async () => {
      const manyIds = Array(51).fill(TOKEN_ADDRESSES.SOL);
      const response = await pricePage.getPrices({
        ids: manyIds,
      });

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property(TOKEN_ADDRESSES.SOL);
      expect(Object.keys(response.data).length).to.equal(1);

      const solPrice = response.data[TOKEN_ADDRESSES.SOL];
      expect(solPrice.usdPrice).to.be.a('number');
      expect(solPrice.usdPrice).to.be.greaterThan(0);
    });
  });
});
