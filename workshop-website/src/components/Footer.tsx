import Link from 'next/link';
import MaterialIcon from './MaterialIcon';

export default function Footer() {
  return (
    <footer className="bg-dark-bg text-gray-300 py-12 border-t border-dark-lighter">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-dark-text font-bold text-lg mb-4">Solana Workshop</h3>
            <p className="text-sm text-gray-400">
              Learn to build Solana dApps 10x faster with AI-powered tools
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-dark-text font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/modules" className="hover:text-primary transition-colors">All Modules</Link></li>
              <li><Link href="/quick-start" className="hover:text-primary transition-colors">Quick Start</Link></li>
              <li><Link href="/quick-reference" className="hover:text-primary transition-colors">Quick Reference</Link></li>
              <li><Link href="/example-app" className="hover:text-primary transition-colors">Example App</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-dark-text font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://kiro.dev/docs/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Kiro Docs</a></li>
              <li><a href="https://docs.solana.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Solana Docs</a></li>
              <li><a href="https://book.anchor-lang.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Anchor Book</a></li>
              <li><a href="https://docs.helius.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Helius Docs</a></li>
              <li><a href="https://docs.ollama.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Ollama Docs</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-dark-text font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/DaemonProtocol" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="Twitter/X">
                <MaterialIcon icon="chat" size={24} />
              </a>
              <a href="https://github.com/daemonprotocol" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="GitHub">
                <MaterialIcon icon="code" size={24} />
              </a>
              <a href="https://kiro.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="Kiro">
                <MaterialIcon icon="terminal" size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-lighter mt-8 pt-8 text-center text-sm">
          <p className="text-gray-400">
            &copy; 2026 Superteam Weekend class, by{' '}
            <a 
              href="https://x.com/DaemonProtocol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-accent transition-colors"
            >
              daemonprotocol
            </a>
            {' '}for the solana community
          </p>
        </div>
      </div>
    </footer>
  );
}
