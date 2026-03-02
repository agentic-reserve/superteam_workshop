import { WalletButton } from "@/components/WalletButton";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { TokenList } from "@/components/TokenList";
import { GuestbookForm } from "@/components/GuestbookForm";
import { GuestbookEntries } from "@/components/GuestbookEntries";
import { useWallet } from "@solana/react-hooks";

export default function Home() {
  const { address } = useWallet();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Solana dApp Demo
            </h1>
            <p className="text-gray-400">
              Token balances + On-chain guestbook
            </p>
          </div>
          <WalletButton />
        </header>

        {/* Content */}
        {address ? (
          <div className="space-y-8">
            {/* SOL Balance */}
            <BalanceDisplay address={address} />

            {/* Guestbook Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GuestbookForm />
              <GuestbookEntries />
            </div>

            {/* Token List */}
            <TokenList address={address} />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto border border-white/10">
              <div className="text-6xl mb-6">👛</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-400 mb-8">
                Connect your Solana wallet to view balances and sign the guestbook
              </p>
              <WalletButton />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>Built with @solana/kit + Helius + Anchor + Next.js</p>
          <p className="mt-2">
            Powered by Kiro AI Development Workflow
          </p>
        </footer>
      </div>
    </main>
  );
}
