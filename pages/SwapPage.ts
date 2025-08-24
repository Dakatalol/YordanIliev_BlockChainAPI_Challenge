import { AxiosResponse } from 'axios';
import { HttpClient } from '../utils/HttpClient';
import { SwapRequest, SwapResponse } from '../types/swapTypes';
import { config } from '../config/environment';

export class SwapPage {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async postSwap(request: SwapRequest): Promise<AxiosResponse<SwapResponse>> {
    return this.httpClient.post<SwapResponse>(`/swap/v1/swap`, request);
  }
}
