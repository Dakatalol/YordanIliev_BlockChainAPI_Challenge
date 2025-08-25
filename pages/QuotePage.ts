import { AxiosResponse } from 'axios';
import { HttpClient } from '../utils/HttpClient';
import { QuoteRequest, QuoteResponse } from '../types/quoteTypes';

export class QuotePage {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  private buildQueryParams(params: Record<string, any>): URLSearchParams {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return queryParams;
  }

  /**
   * Retrieves a quote for token swaps with specified parameters
   * @param params - The quote request containing swap parameters
   * @returns Promise resolving to quote response with pricing and route information
   */
  async getQuote(params: QuoteRequest): Promise<AxiosResponse<QuoteResponse>> {
    const queryParams = this.buildQueryParams(params);
    return this.httpClient.get<QuoteResponse>(`/swap/v1/quote?${queryParams.toString()}`);
  }
}
