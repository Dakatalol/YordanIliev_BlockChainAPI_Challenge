import { HttpClient } from '../utils/HttpClient';
import { PriceRequest, PriceResponse } from '../types/priceTypes';
import { AxiosResponse } from 'axios';

/**
 * Page Object Model for Jupiter Price API endpoints
 * Handles price retrieval for multiple token mint addresses
 */
export class PricePage {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get prices for multiple tokens by mint addresses
   * @param request - Price request parameters with token IDs
   * @returns Promise with price response
   */
  async getPrices(request: PriceRequest): Promise<AxiosResponse<PriceResponse>> {
    const params = new URLSearchParams();
    params.append('ids', request.ids.join(','));

    return this.httpClient.get<PriceResponse>(`/price/v3?${params.toString()}`);
  }
}
