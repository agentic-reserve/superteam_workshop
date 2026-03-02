"use client";

import { useState, useEffect } from "react";
import { createHelius } from "helius-sdk";
import type { Address } from "@solana/kit";
import type { Token } from "@/types";

const helius = createHelius({
  apiKey: process.env.NEXT_PUBLIC_HELIUS_API_KEY || "",
});

export function useTokens(address: Address | null) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setTokens([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchTokens() {
      try {
        setLoading(true);
        setError(null);

        // Use Helius DAS API to get token accounts
        const assets = await helius.getAssetsByOwner({
          ownerAddress: address,
          page: 1,
          limit: 100,
          displayOptions: {
            showFungible: true,
            showNativeBalance: false,
          },
        });

        if (mounted) {
          const tokenList: Token[] = assets.items
            .filter((asset: any) => asset.interface === "FungibleToken")
            .map((asset: any) => ({
              mint: asset.id,
              name: asset.content?.metadata?.name || "Unknown Token",
              symbol: asset.content?.metadata?.symbol || "???",
              balance: asset.token_info?.balance || 0,
              decimals: asset.token_info?.decimals || 0,
              uiAmount: asset.token_info?.balance 
                ? asset.token_info.balance / Math.pow(10, asset.token_info.decimals || 0)
                : 0,
              image: asset.content?.links?.image || null,
            }));

          setTokens(tokenList);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch tokens"));
          // Fallback to empty array on error
          setTokens([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchTokens();

    return () => {
      mounted = false;
    };
  }, [address]);

  return { tokens, loading, error };
}
