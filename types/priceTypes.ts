export interface PriceRequest {
  ids: string[];
}

export interface TokenPrice {
  usdPrice: number;
  blockId: number;
  decimals: number;
  priceChange24h: number;
}

export interface PriceResponse {
  [tokenId: string]: TokenPrice;
}
