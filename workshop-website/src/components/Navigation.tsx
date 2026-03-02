'use client';

import Link from 'next/link';
import { useState } from 'react';
import MaterialIcon from './MaterialIcon';
import WalletButton from './WalletButton';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-card shadow-lg sticky top-0 z-50 border-b border-dark-lighter">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/LogoHorizontal-White.png" 
              alt="Superteam Indonesia" 
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block h-8 w-px bg-dark-lighter" />
            <span className="hidden sm:block font-bold text-lg text-dark-text group-hover:text-primary transition-colors">Solana Workshop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/modules" className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors">
              <MaterialIcon icon="library_books" size={20} />
              <span>Modules</span>
            </Link>
            <Link href="/audit" className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors">
              <MaterialIcon icon="security" size={20} />
              <span>Audit</span>
            </Link>
            <Link href="/dashboard" className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors">
              <MaterialIcon icon="dashboard" size={20} />
              <span>Dashboard</span>
            </Link>
            <Link href="/quick-start" className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors">
              <MaterialIcon icon="bolt" size={20} />
              <span>Quick Start</span>
            </Link>
            <Link href="/quick-reference" className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors">
              <MaterialIcon icon="description" size={20} />
              <span>Reference</span>
            </Link>
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-dark-text"
          >
            <MaterialIcon icon={isOpen ? "close" : "menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-dark-lighter">
            <Link 
              href="/modules" 
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <MaterialIcon icon="library_books" size={20} />
              Modules
            </Link>
            <Link 
              href="/audit" 
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <MaterialIcon icon="security" size={20} />
              Audit
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <MaterialIcon icon="dashboard" size={20} />
              Dashboard
            </Link>
            <Link 
              href="/quick-start" 
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <MaterialIcon icon="bolt" size={20} />
              Quick Start
            </Link>
            <Link 
              href="/quick-reference" 
              className="flex items-center gap-2 py-2 text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <MaterialIcon icon="description" size={20} />
              Quick Reference
            </Link>
            <div className="pt-4 border-t border-dark-lighter">
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
