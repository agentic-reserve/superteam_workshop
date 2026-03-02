"use client";

import type { Token } from "@/types";

interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  return (
    <div className="bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {token.image ? (
            <img
              src={token.image}
              alt={token.symbol}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {token.symbol.slice(0, 1)}
            </div>
          )}
          <div>
            <p className="font-bold text-white">{token.symbol}</p>
            <p className="text-xs text-gray-400">{token.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Balance</span>
          <span className="text-white font-medium">
            {token.balance.toLocaleString()}
          </span>
        </div>

        {token.uiAmount && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Amount</span>
            <span className="text-white font-medium">
              {token.uiAmount.toFixed(4)}
            </span>
          </div>
        )}

        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-gray-500 truncate">
            {token.mint}
          </p>
        </div>
      </div>
    </div>
  );
}
