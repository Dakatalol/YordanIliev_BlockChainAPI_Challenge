export interface SwapInstructionsRequest {
  quoteResponse: any; // Quote response object from /quote endpoint
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
  feeAccount?: string;
  prioritizationFeeLamports?: number | string;
  dynamicComputeUnitLimit?: boolean;
  asLegacyTransaction?: boolean;
}

export interface SwapInstruction {
  programId: string;
  accounts: Array<{
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
  }>;
  data: string; // Base64 encoded instruction data
}

export interface AddressLookupTable {
  accountKey: string;
  writableIndexes: number[];
  readonlyIndexes: number[];
}

export interface SwapInstructionsResponse {
  tokenLedgerInstruction?: SwapInstruction;
  computeBudgetInstructions: SwapInstruction[];
  setupInstructions: SwapInstruction[];
  swapInstruction: SwapInstruction;
  cleanupInstruction?: SwapInstruction;
  addressLookupTableAddresses?: AddressLookupTable[];
  prioritizationFeeLamports?: number;
  computeUnitLimit?: number;
}

export interface SwapInstructionsErrorResponse {
  error: string;
  message?: string;
}

export type SwapInstructionsApiResponse = SwapInstructionsResponse | SwapInstructionsErrorResponse;