import { expect } from 'chai';
import { HttpClient } from '../utils/HttpClient';
import { TokenPage } from '../pages/TokenPage';
import { config } from '../config/environment';
import { TOKEN_ADDRESSES } from '../constants/constants';

describe('Jupiter Token API Tests', () => {
  let httpClient: HttpClient;
  let tokenPage: TokenPage;

  before(() => {
    httpClient = new HttpClient(config.JUPITER_BASE_URL);
    tokenPage = new TokenPage(httpClient);
  });

  describe('Token Search Tests', () => {
    it('TC-01: Should search token by mint address', async () => {
      // Search for SOL token by mint address
      const response = await tokenPage.searchTokens({
        query: TOKEN_ADDRESSES.SOL,
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.be.greaterThan(0);

      // Validate SOL token specific properties
      const token = response.data[0];
      expect(token.id).to.equal(TOKEN_ADDRESSES.SOL);
      expect(token.symbol).to.equal('SOL');
      expect(token.name).to.equal('Wrapped SOL');
      expect(token.decimals).to.equal(9);
      expect(token.isVerified).to.be.true;
    });

    it('TC-02: Should search token by symbol', async () => {
      // Search for SOL token by symbol
      const response = await tokenPage.searchTokens({
        query: 'SOL',
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.be.greaterThan(0);

      // Should find SOL token in results
      const solToken = response.data.find((token: any) => token.id === TOKEN_ADDRESSES.SOL);
      expect(solToken).to.exist;
      expect(solToken.symbol).to.equal('SOL');
    });

    it('TC-03: Should search token by partial name', async () => {
      // Search for Jupiter token by partial name
      const response = await tokenPage.searchTokens({
        query: 'Jupit',
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.be.greaterThan(0);

      // Should find multiple Jupiter-related tokens
      const jupiterTokens = response.data.filter(
        (token: any) =>
          token.name.toLowerCase().includes('jupiter') || token.symbol.toLowerCase().includes('jup')
      );

      expect(jupiterTokens.length).to.be.greaterThan(
        1,
        'Should find multiple Jupiter-related tokens'
      );
    });

    it('TC-04: Should search multiple tokens with mints parameter', async () => {
      // Search for multiple tokens by mint addresses - SOL and USDC
      const response = await tokenPage.searchTokens({
        query: TOKEN_ADDRESSES.SOL + ',' + TOKEN_ADDRESSES.USDC,
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.be.greaterThan(1);

      // Should find at least one of the tokens
      const tokenIds = response.data.map((token: any) => token.id);
      const hasRequiredTokens =
        tokenIds.includes(TOKEN_ADDRESSES.SOL) || tokenIds.includes(TOKEN_ADDRESSES.USDC);
      expect(hasRequiredTokens).to.be.true;
    });

    it('TC-05: Should return max 5 tokens by limit parameter', async () => {
      // Search with limit of 5 tokens
      const response = await tokenPage.searchTokens({
        query: 'token',
        limit: 5,
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.be.at.most(5);
    });
  });

  describe('Error Handling Tests', () => {
    it('TC-06: Should handle invalid token search', async () => {
      // Search for non-existent token
      const response = await tokenPage.searchTokens({
        query: 'NonExistentToken123456789',
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.equal(0);
    });

    it('TC-07: Should reject empty query with validation error', async () => {
      // Search with empty string
      const response = await tokenPage.searchTokens({
        query: '',
      });

      expect(response.status).to.equal(400);
      expect(response.data).to.have.property('status', 400);
      expect(response.data.message).to.include('Expected required property');
    });
  });

  describe('Token Tag Tests', () => {
    it('TC-08: Should get verified tokens', async () => {
      const response = await tokenPage.getTokensByTag({
        tag: 'verified',
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.be.greaterThan(0);

      // All returned tokens should be verified
      response.data.forEach((token: any) => {
        expect(token.isVerified).to.be.true;
      });
    });

    it('TC-09: Should get lst tokens', async () => {
      const response = await tokenPage.getTokensByTag({
        tag: 'lst',
      });

      expect(response.status).to.equal(200);
      expect(response.data.length).to.be.greaterThan(0);

      // All returned tokens should have 'lst' tag
      response.data.forEach((token: any) => {
        expect(token.tags).to.include('lst');
      });
    });

    it('TC-10: Should handle unrecognized tag (negative case)', async () => {
      const response = await tokenPage.getTokensByTag({
        tag: 'invalidtag' as any,
      });

      expect(response.status).to.equal(400);
      expect(response.data.message).to.equal('Invalid tag provided.');
    });
  });
});
