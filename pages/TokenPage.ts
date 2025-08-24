import { HttpClient } from '../utils/HttpClient';
import { TokenSearchRequest } from '../types/tokenTypes';
import { config } from '../config/environment';

/**
 * Page Object Model for Jupiter Token API endpoints
 * Handles token search by symbol, name, or mint address
 */
export class TokenPage {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Search tokens by symbol, name, or mint address
   * @param request - Token search parameters
   * @returns Promise with token search response
   */
  async searchTokens(request: TokenSearchRequest): Promise<any> {
    const params = new URLSearchParams();

    if (request.query) {
      params.append('query', request.query);
    }

    if (request.mints && request.mints.length > 0) {
      // Multiple mints can be passed as comma-separated values
      params.append('mints', request.mints.join(','));
    }

    if (request.limit) {
      params.append('limit', request.limit.toString());
    }

    return this.httpClient.get(`/tokens/v2/search?${params.toString()}`);
  }
}
