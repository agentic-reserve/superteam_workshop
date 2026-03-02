import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WalletProvider from "@/components/WalletProvider";
import AIAssistant from "@/components/AIAssistant";
import ProgressTracker from "@/components/ProgressTracker";
import AchievementSystem from "@/components/AchievementSystem";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Workshop - Optimizing Fullstack Development dengan Kiro",
  description: "Learn to build Solana dApps 10x faster with AI-powered tools: Kiro, OpenClaw, and Ollama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <WalletProvider>
          <Navigation />
          <main className="min-h-screen pt-24">
            {children}
          </main>
          <Footer />
          <ProgressTracker />
          <AIAssistant />
          <AchievementSystem />
        </WalletProvider>
      </body>
    </html>
  );
}
