import { AxiosResponse } from 'axios';
import { HttpClient } from '../utils/HttpClient';
import { SwapInstructionsRequest, SwapInstructionsResponse } from '../types/swapInstructionsTypes';

/**
 * Page object for Jupiter's swap-instructions API endpoint
 */
export class SwapInstructionsPage {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Request swap instructions from a quote response
   * @param request - Swap instructions request parameters
   * @returns Promise resolving to the swap instructions response
   */
  async postSwapInstructions(
    request: SwapInstructionsRequest
  ): Promise<AxiosResponse<SwapInstructionsResponse>> {
    return this.httpClient.post<SwapInstructionsResponse>('/swap-instructions', request);
  }
}
