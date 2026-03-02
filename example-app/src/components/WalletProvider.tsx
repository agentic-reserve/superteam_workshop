"use client";

import { ReactNode } from "react";
import { SolanaProvider } from "@solana/react-hooks";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com";
const wsUrl = rpcUrl.replace("https://", "wss://").replace("http://", "ws://");

const rpc = createSolanaRpc(rpcUrl);
const rpcSubscriptions = createSolanaRpcSubscriptions(wsUrl);

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaProvider rpc={rpc} rpcSubscriptions={rpcSubscriptions}>
      {children}
    </SolanaProvider>
  );
}
