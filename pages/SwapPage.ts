import { AxiosResponse } from 'axios';
import { HttpClient } from '../utils/HttpClient';
import { SwapRequest, SwapResponse } from '../types/swapTypes';

export class SwapPage {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Creates a swap transaction from a quote response
   * @param request - The swap request containing quote response and user details
   * @returns Promise resolving to swap transaction response
   */
  async postSwap(request: SwapRequest): Promise<AxiosResponse<SwapResponse>> {
    return this.httpClient.post<SwapResponse>(`/swap/v1/swap`, request);
  }
}
