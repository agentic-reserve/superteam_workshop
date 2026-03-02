"use client";

import { useState, useEffect } from "react";
import { createSolanaRpc, type Address, type Lamports } from "@solana/kit";

const rpc = createSolanaRpc(
  process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com"
);

export function useBalance(address: Address | null) {
  const [balance, setBalance] = useState<Lamports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchBalance() {
      try {
        setLoading(true);
        setError(null);

        const result = await rpc.getBalance(address).send();
        
        if (mounted) {
          setBalance(result.value);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch balance"));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchBalance();

    // Poll every 10 seconds
    const interval = setInterval(fetchBalance, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [address]);

  return { balance, loading, error };
}
