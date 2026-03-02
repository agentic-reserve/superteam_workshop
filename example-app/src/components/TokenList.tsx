"use client";

import { useTokens } from "@/hooks/useTokens";
import { TokenCard } from "./TokenCard";
import type { Address } from "@solana/kit";

interface TokenListProps {
  address: Address;
}

export function TokenList({ address }: TokenListProps) {
  const { tokens, loading, error } = useTokens(address);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Token Balances</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 rounded-xl p-4 animate-pulse"
            >
              <div className="h-6 bg-white/10 rounded w-32 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20">
        <p className="text-red-400">Failed to load tokens</p>
      </div>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-4">🪙</div>
        <p className="text-gray-400">No tokens found</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">
        Token Balances ({tokens.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <TokenCard key={token.mint} token={token} />
        ))}
      </div>
    </div>
  );
}
