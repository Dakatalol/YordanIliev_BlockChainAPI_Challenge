export interface DynamicSlippageConfig {
  maxBps: number;
}

export interface SwapRequest {
  quoteResponse: any; // Quote response from the quote API
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
  feeAccount?: string;
  dynamicSlippage?: DynamicSlippageConfig;
  prioritizationFeeLamports?: number | string;
  dynamicComputeUnitLimit?: boolean;
}

export interface DynamicSlippageReport {
  slippageBps: number;
  otherAmount: number;
}

export interface SwapResponse {
  swapTransaction: string; // Base64 encoded serialized transaction
  lastValidBlockHeight: number;
  prioritizationFeeLamports?: number;
  computeUnitLimit?: number;
  dynamicSlippageReport?: DynamicSlippageReport;
  simulationError: {
    errorCode: string;
    error: string;
  } | null;
}

export interface SwapErrorResponse {
  error: string;
  message?: string;
}

export type SwapApiResponse = SwapResponse | SwapErrorResponse;
