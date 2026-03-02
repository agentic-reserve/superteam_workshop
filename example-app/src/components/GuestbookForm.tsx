"use client";

import { useState } from "react";
import { useWallet } from "@solana/react-hooks";

export function GuestbookForm() {
  const { address } = useWallet();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    if (message.length > 280) {
      setError("Message too long (max 280 characters)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // TODO: Implement actual transaction
      // await createEntry(signer, message);
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setMessage("");
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">
        Sign the Guestbook
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            Your Message (max 280 characters)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave your message on the Solana blockchain..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            rows={4}
            maxLength={280}
            disabled={loading || !address}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {message.length}/280
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400 text-sm">
              ✓ Entry created successfully!
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !address || !message.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Entry..." : "Sign Guestbook"}
        </button>

        {!address && (
          <p className="text-center text-gray-400 text-sm">
            Connect your wallet to sign the guestbook
          </p>
        )}
      </form>
    </div>
  );
}
