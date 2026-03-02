"use client";

import { useState, useEffect } from "react";

interface Entry {
  author: string;
  message: string;
  timestamp: number;
}

export function GuestbookEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual entries from blockchain
    // For now, show sample data
    setTimeout(() => {
      setEntries([
        {
          author: "7xKX...9Abc",
          message: "Hello from Solana! This is amazing! 🚀",
          timestamp: Date.now() - 3600000,
        },
        {
          author: "5mNp...2Def",
          message: "Building on Solana is so fast and efficient!",
          timestamp: Date.now() - 7200000,
        },
        {
          author: "9qRt...4Ghi",
          message: "Love the Kiro development workflow! 💜",
          timestamp: Date.now() - 10800000,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Entries</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
              <div className="h-6 bg-white/10 rounded w-full mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-gray-400">No entries yet. Be the first to sign!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">
        Recent Entries ({entries.length})
      </h2>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-purple-400 font-mono text-sm">
                {entry.author}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-white">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
