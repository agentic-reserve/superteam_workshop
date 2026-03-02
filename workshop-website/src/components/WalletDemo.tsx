'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import MaterialIcon from './MaterialIcon';

export default function WalletDemo() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true);
      connection.getBalance(publicKey)
        .then(bal => setBalance(bal / LAMPORTS_PER_SOL))
        .catch(err => console.error('Error fetching balance:', err))
        .finally(() => setLoading(false));
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, connection]);

  if (!connected) {
    return (
      <div className="card text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <MaterialIcon icon="account_balance_wallet" size={32} className="text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 mb-4">
          Connect wallet untuk explore Solana features di workshop ini
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <MaterialIcon icon="info" size={16} />
          <span>Devnet mode - Safe untuk testing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <MaterialIcon icon="check_circle" size={24} className="text-green-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Wallet Connected!</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MaterialIcon icon="account_circle" size={16} className="text-primary" />
              <span className="text-gray-400">Address:</span>
              <code className="text-primary bg-dark-bg px-2 py-1 rounded">
                {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="account_balance" size={16} className="text-primary" />
              <span className="text-gray-400">Balance:</span>
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <span className="text-primary font-semibold">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : 'N/A'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="cloud" size={16} className="text-primary" />
              <span className="text-gray-400">Network:</span>
              <span className="text-primary">Devnet</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <MaterialIcon icon="lightbulb" size={16} className="text-primary mt-0.5" />
              <p className="text-xs text-gray-400">
                Need devnet SOL? Visit{' '}
                <a 
                  href="https://faucet.solana.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-accent underline"
                >
                  Solana Faucet
                </a>
                {' '}to get free test tokens
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
