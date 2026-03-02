"use client";

import { useWallet } from "@solana/react-hooks";
import { useState } from "react";

export function WalletButton() {
  const { address, connect, disconnect, connecting } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  if (address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl font-medium transition-all border border-white/20"
        >
          {address.slice(0, 4)}...{address.slice(-4)}
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
