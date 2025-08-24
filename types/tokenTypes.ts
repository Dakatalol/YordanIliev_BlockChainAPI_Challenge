export interface TokenSearchRequest {
  query?: string;
  mints?: string[];
  limit?: number;
}

export interface TokenTagRequest {
  tag: 'verified' | 'lst';
}

export interface TokenInfo {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
  tags?: string[];
  circSupply?: number;
  totalSupply?: number;
  tokenProgram?: string;
  holderCount?: number;
  organicScore?: number;
  organicScoreLabel?: string;
  isVerified?: boolean;
  fdv?: number;
  mcap?: number;
  usdPrice?: number;
  liquidity?: number;
  updatedAt?: string;
}

export interface TokenSearchResponse extends Array<TokenInfo> {}
