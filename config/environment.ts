import dotenv from 'dotenv';

dotenv.config();

export const config = {
  JUPITER_BASE_URL: process.env.JUPITER_BASE_URL || 'https://lite-api.jup.ag/swap/v1'
};