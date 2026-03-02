"use client";

import { useBalance } from "@/hooks/useBalance";
import type { Address } from "@solana/kit";

interface BalanceDisplayProps {
  address: Address;
}

export function BalanceDisplay({ address }: BalanceDisplayProps) {
  const { balance, loading, error } = useBalance(address);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-32 mb-4"></div>
        <div className="h-12 bg-white/10 rounded w-48"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/20">
        <p className="text-red-400">Failed to load balance</p>
      </div>
    );
  }

  const solBalance = balance ? Number(balance) / 1_000_000_000 : 0;

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">SOL Balance</p>
          <p className="text-4xl font-bold text-white">
            {solBalance.toFixed(4)} SOL
          </p>
          <p className="text-gray-400 text-sm mt-2">
            ≈ ${(solBalance * 100).toFixed(2)} USD
          </p>
        </div>
        <div className="text-6xl">◎</div>
      </div>
    </div>
  );
}
