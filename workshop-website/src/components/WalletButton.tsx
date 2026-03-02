'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import MaterialIcon from './MaterialIcon';

// Dynamically import WalletMultiButton to avoid hydration issues
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-3">
      {connected && publicKey && (
        <div className="hidden md:flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
          <span className="text-gray-400">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
      <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-dark-text !rounded-lg !font-semibold !px-4 !py-2 !transition-colors !flex !items-center !gap-2" />
    </div>
  );
}
