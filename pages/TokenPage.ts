import { HttpClient } from '../utils/HttpClient';
import { TokenSearchRequest, TokenTagRequest } from '../types/tokenTypes';

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

  /**
   * Get tokens by tag (verified or lst)
   * @param request - Token tag request parameters
   * @returns Promise with token tag response
   */
  async getTokensByTag(request: TokenTagRequest): Promise<any> {
    const params = new URLSearchParams();
    params.append('query', request.tag);

    return this.httpClient.get(`/tokens/v2/tag?${params.toString()}`);
  }
}
