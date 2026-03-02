'use client';

import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import AnimatedSection from '@/components/AnimatedSection';
import InteractiveCard from '@/components/InteractiveCard';
import ScrollProgress from '@/components/ScrollProgress';
import WalletDemo from '@/components/WalletDemo';
import ColorBends from '@/components/ColorBends';
import DecryptedText from '@/components/DecryptedText';
import GradualBlur from '@/components/GradualBlur';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <div>
      {/* Hero Section */}
      <section className="bg-dark-bg text-dark-text py-32 pt-40 relative overflow-hidden border-b border-dark-lighter min-h-screen flex items-center">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent
          autoRotate={0}
          className="absolute inset-0 opacity-20"
        />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fadeIn" duration={1000}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <img 
                  src="/Size=72, Color=white.png" 
                  alt="Superteam Workshop Logo" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <DecryptedText
                  text="Optimizing Solana Fullstack Development"
                  animateOn="view"
                  sequential
                  speed={30}
                  revealDirection="center"
                  className="text-primary"
                  encryptedClassName="text-gray-500"
                />
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-gray-300">
                Solana AI Assistant powered by daemonprotocol
              </p>
              <p className="text-lg mb-10 text-gray-400">
                Build Solana dApps 10x faster dengan Kiro, OpenClaw, dan Ollama
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/modules" className="btn-primary inline-flex items-center justify-center gap-2">
                  <MaterialIcon icon="school" size={20} />
                  Mulai Belajar
                </Link>
                <Link href="/audit" className="btn-secondary inline-flex items-center justify-center gap-2">
                  <MaterialIcon icon="security" size={20} />
                  AI Security Audit
                </Link>
                <Link href="/quick-start" className="btn-secondary inline-flex items-center justify-center gap-2">
                  <MaterialIcon icon="bolt" size={20} />
                  Quick Start
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <GradualBlur
          position="bottom"
          height="10rem"
          strength={3}
          divCount={7}
          curve="bezier"
          exponential
          opacity={1}
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection animation="scale" delay={100}>
              <div className="flex flex-col items-center">
                <MaterialIcon icon="speed" size={40} className="text-primary mb-2" />
                <div className="text-4xl font-bold text-primary mb-2">10x</div>
                <div className="text-gray-400">Faster Development</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={200}>
              <div className="flex flex-col items-center">
                <MaterialIcon icon="library_books" size={40} className="text-primary mb-2" />
                <div className="text-4xl font-bold text-primary mb-2">17</div>
                <div className="text-gray-400">Comprehensive Modules</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={300}>
              <div className="flex flex-col items-center">
                <MaterialIcon icon="schedule" size={40} className="text-primary mb-2" />
                <div className="text-4xl font-bold text-primary mb-2">20h</div>
                <div className="text-gray-400">Total Learning Time</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={400}>
              <div className="flex flex-col items-center">
                <MaterialIcon icon="code" size={40} className="text-primary mb-2" />
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-gray-400">Code Examples</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Wallet Demo Section */}
      <section className="py-16 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection animation="slideUp">
              <WalletDemo />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-12">Kenapa Workshop Ini?</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedSection animation="slideUp" delay={100}>
              <InteractiveCard className="card text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon icon="psychology" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
                <p className="text-gray-400">
                  Kiro, OpenClaw, dan Ollama membantu kamu code lebih cepat dan smart
                </p>
              </InteractiveCard>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={200}>
              <InteractiveCard className="card text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon icon="verified" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Production Ready</h3>
                <p className="text-gray-400">
                  Best practices, security checks, dan deployment automation built-in
                </p>
              </InteractiveCard>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={300}>
              <InteractiveCard className="card text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon icon="groups" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
                <p className="text-gray-400">
                  Multi-platform notifications, shared workflows, dan team automation
                </p>
              </InteractiveCard>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={400}>
              <InteractiveCard className="card text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon icon="deployed_code" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Complete Stack</h3>
                <p className="text-gray-400">
                  Frontend, smart contracts, infrastructure, testing, dan deployment
                </p>
              </InteractiveCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 bg-dark-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Pilih Learning Path Kamu</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link href="/paths/quick-start" className="card hover:border-primary border-2 border-transparent transition-all group">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="flash_on" size={48} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">2 jam</div>
                <h3 className="text-2xl font-bold mb-4">Quick Start</h3>
                <p className="text-gray-400 mb-6">
                  Setup environment, activate skills, dan build first dApp
                </p>
                <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <MaterialIcon icon="person" size={16} />
                  Perfect untuk: Beginners
                </div>
              </div>
            </Link>
            
            <Link href="/paths/comprehensive" className="card hover:border-primary border-2 border-transparent transition-all group">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="workspace_premium" size={48} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">7 jam</div>
                <h3 className="text-2xl font-bold mb-4">Comprehensive</h3>
                <p className="text-gray-400 mb-6">
                  Master semua features dari Skills sampai Production
                </p>
                <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <MaterialIcon icon="trending_up" size={16} />
                  Perfect untuk: Intermediate
                </div>
              </div>
            </Link>
            
            <Link href="/paths/team-setup" className="card hover:border-primary border-2 border-transparent transition-all group">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <MaterialIcon icon="diversity_3" size={48} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">4 jam</div>
                <h3 className="text-2xl font-bold mb-4">Team Setup</h3>
                <p className="text-gray-400 mb-6">
                  Setup OpenClaw untuk team collaboration dan automation
                </p>
                <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <MaterialIcon icon="group_work" size={16} />
                  Perfect untuk: Teams
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-dark-bg">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-12">Tech Stack</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimatedSection animation="slideUp" delay={100}>
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <MaterialIcon icon="web" size={24} className="text-primary" />
                  <h3 className="text-xl font-bold text-primary">Frontend</h3>
                </div>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Next.js + React
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    @solana/kit SDK
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Wallet Standard
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Helius RPC
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={200}>
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <MaterialIcon icon="code" size={24} className="text-primary" />
                  <h3 className="text-xl font-bold text-primary">Smart Contracts</h3>
                </div>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Anchor Framework
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Pinocchio (optimized)
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    LiteSVM Testing
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Mollusk + Surfpool
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={300}>
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <MaterialIcon icon="smart_toy" size={24} className="text-primary" />
                  <h3 className="text-xl font-bold text-primary">AI Tools</h3>
                </div>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Kiro (AI IDE)
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    OpenClaw (Multi-platform)
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Ollama (Local/Cloud)
                  </li>
                  <li className="flex items-center gap-2">
                    <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                    Solana Agent Kit
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Advanced Technologies */}
      <section className="py-20 bg-dark-card">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="slideUp">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Advanced Solana Technologies</h2>
              <p className="text-xl text-gray-400">
                Learn cutting-edge protocols untuk scale dan optimize dApps
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <AnimatedSection animation="slideLeft" delay={100}>
              <InteractiveCard className="card h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MaterialIcon icon="compress" size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Light Protocol</h3>
                    <p className="text-sm text-primary">ZK Compression + Light Token Program</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  Build scalable, cost-efficient applications dengan rent-free compressed tokens dan PDAs menggunakan zero-knowledge proofs.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="bolt" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-primary">200x Cost Reduction</div>
                      <div className="text-sm text-gray-500">Compressed accounts ~5K lamports vs 2M SPL</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="account_balance_wallet" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-primary">Rent-Free Accounts</div>
                      <div className="text-sm text-gray-500">No upfront rent-exemption required</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="security" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-primary">L1 Security</div>
                      <div className="text-sm text-gray-500">All execution on Solana mainnet</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-dark-lighter">
                  <div className="text-sm text-gray-500 mb-2">Use Cases:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-dark-bg px-3 py-1 rounded-full text-primary">Token Airdrops</span>
                    <span className="text-xs bg-dark-bg px-3 py-1 rounded-full text-primary">NFT Collections</span>
                    <span className="text-xs bg-dark-bg px-3 py-1 rounded-full text-primary">DeFi Protocols</span>
                  </div>
                </div>
              </InteractiveCard>
            </AnimatedSection>

            <AnimatedSection animation="slideRight" delay={200}>
              <InteractiveCard className="card h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MaterialIcon icon="speed" size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">MagicBlock</h3>
                    <p className="text-sm text-primary">Ephemeral Rollups + Solana Plugins</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  High-performance Solana execution dengan sub-10ms latency, gasless transactions, dan modular capabilities.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="flash_on" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-primary">Sub-10ms Latency</div>
                      <div className="text-sm text-gray-500">40x faster than base Solana (~400ms)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="money_off" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-primary">Gasless Transactions</div>
                      <div className="text-sm text-gray-500">Zero fees untuk seamless UX</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MaterialIcon icon="extension" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-primary">Solana Plugins</div>
                      <div className="text-sm text-gray-500">VRF, Price Feeds, AI Oracles</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-dark-lighter">
                  <div className="text-sm text-gray-500 mb-2">Use Cases:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-dark-bg px-3 py-1 rounded-full text-primary">Gaming</span>
                    <span className="text-xs bg-dark-bg px-3 py-1 rounded-full text-primary">HFT</span>
                    <span className="text-xs bg-dark-bg px-3 py-1 rounded-full text-primary">Real-time Apps</span>
                  </div>
                </div>
              </InteractiveCard>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="fadeIn" delay={300}>
            <div className="text-center mt-12">
              <Link href="/modules/01" className="btn-primary inline-flex items-center gap-2">
                <MaterialIcon icon="school" size={20} />
                Learn These Technologies in Workshop
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-dark-bg relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <MaterialIcon icon="celebration" size={64} className="text-dark-bg" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-dark-bg">Ready to Build?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-dark-bg/80">
            Mulai journey kamu untuk jadi Solana developer yang 10x lebih produktif
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/modules" className="bg-dark-bg text-primary px-8 py-4 rounded-lg font-bold hover:bg-dark-card hover:shadow-lg transition-all inline-flex items-center justify-center gap-2">
              <MaterialIcon icon="menu_book" size={20} className="text-primary" />
              Lihat Semua Modul
            </Link>
            <Link href="/quick-reference" className="bg-transparent border-2 border-dark-bg text-dark-bg px-8 py-4 rounded-lg font-bold hover:bg-dark-bg hover:text-primary transition-all inline-flex items-center justify-center gap-2">
              <MaterialIcon icon="description" size={20} />
              Quick Reference
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
