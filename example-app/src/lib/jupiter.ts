/**
 * Jupiter Ultra Swap Integration
 * 
 * This module demonstrates Jupiter API integration with @solana/kit
 * for building token swap functionality.
 */

import { 
  createSolanaRpc,
  type Address,
  type KeyPairSigner,
} from "@solana/kit";
import { createHelius } from "helius-sdk";

const JUPITER_API_KEY = process.env.NEXT_PUBLIC_JUPITER_API_KEY;
const JUPITER_BASE_URL = "https://api.jup.ag";

const rpc = createSolanaRpc(process.env.NEXT_PUBLIC_RPC_URL!);
const helius = createHelius({ apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY! });

/**
 * Jupiter API client with authentication
 */
async function jupiterFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add API key if available
  if (JUPITER_API_KEY) {
    headers['x-api-key'] = JUPITER_API_KEY;
  }

  const res = await fetch(`${JUPITER_BASE_URL}${path}`, {
    ...init,
    headers: { ...headers, ...init?.headers },
  });

  // Handle rate limiting
  if (res.status === 429) {
    throw new Error('Rate limited. Please try again in 10 seconds.');
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Jupiter API error: ${errorText || res.statusText}`);
  }

  return res.json();
}

/**
 * Get swap quote from Jupiter
 */
export async function getJupiterQuote(params: {
  inputMint: Address;
  outputMint: Address;
  amount: number;
  slippageBps?: number;
}) {
  const { inputMint, outputMint, amount, slippageBps = 50 } = params;

  // Convert amount to lamports (assuming 9 decimals)
  const amountLamports = Math.floor(amount * 1_000_000_000);

  const quote = await jupiterFetch<any>('/ultra/v1/order', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputMint,
      outputMint,
      amount: amountLamports,
      slippageBps,
    }),
  });

  return {
    inputAmount: amount,
    outputAmount: quote.outAmount / 1_000_000_000,
    priceImpact: quote.priceImpactPct,
    route: quote.routePlan,
    quote,
  };
}

/**
 * Execute Jupiter swap
 */
export async function executeJupiterSwap(params: {
  signer: KeyPairSigner;
  quote: any;
}) {
  const { signer, quote } = params;

  // Get priority fee from Helius
  const { priorityFeeEstimate } = await helius.getPriorityFeeEstimate({
    accountKeys: [signer.address],
    options: { priorityLevel: "HIGH" },
  });

  // Execute swap via Jupiter
  const swapResult = await jupiterFetch<any>('/ultra/v1/execute', {
    method: 'POST',
    body: JSON.stringify({
      quote,
      userPublicKey: signer.address,
      priorityFee: priorityFeeEstimate,
    }),
  });

  // Sign and send transaction
  // Note: This is a simplified example
  // In production, use proper transaction signing with @solana/kit

  return {
    signature: swapResult.txid,
    success: true,
  };
}

/**
 * Get token price from Jupiter
 */
export async function getTokenPrice(mints: Address[]): Promise<Record<string, number>> {
  const prices = await jupiterFetch<any>(`/price/v3?ids=${mints.join(',')}`);
  
  const priceMap: Record<string, number> = {};
  for (const [mint, data] of Object.entries(prices.data || {})) {
    priceMap[mint] = (data as any).price || 0;
  }
  
  return priceMap;
}

/**
 * Search tokens via Jupiter
 */
export async function searchTokens(query: string) {
  const results = await jupiterFetch<any>(`/tokens/v2/search?query=${encodeURIComponent(query)}`);
  
  return results.map((token: any) => ({
    mint: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logoURI,
    verified: token.tags?.includes('verified'),
  }));
}

/**
 * Get popular tokens
 */
export async function getPopularTokens() {
  const tokens = await jupiterFetch<any>('/tokens/v2/toptraded/24h');
  
  return tokens.map((token: any) => ({
    mint: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logoURI,
    volume24h: token.volume24h,
  }));
}

/**
 * Example: Complete swap flow
 */
export async function performSwap(params: {
  signer: KeyPairSigner;
  inputMint: Address;
  outputMint: Address;
  amount: number;
  slippageBps?: number;
}) {
  try {
    // 1. Get quote
    console.log('Getting quote...');
    const quote = await getJupiterQuote(params);
    
    console.log(`Quote: ${quote.inputAmount} → ${quote.outputAmount}`);
    console.log(`Price impact: ${quote.priceImpact}%`);

    // 2. Execute swap
    console.log('Executing swap...');
    const result = await executeJupiterSwap({
      signer: params.signer,
      quote: quote.quote,
    });

    console.log(`Swap successful! Signature: ${result.signature}`);
    
    return result;
  } catch (error) {
    console.error('Swap failed:', error);
    throw error;
  }
}
