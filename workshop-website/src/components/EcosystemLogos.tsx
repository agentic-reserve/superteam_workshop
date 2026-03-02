'use client';

import BrandLogo from './BrandLogo';
import AnimatedSection from './AnimatedSection';

const ecosystemPartners = [
  { domain: 'solana.com', name: 'Solana' },
  { domain: 'phantom.app', name: 'Phantom' },
  { domain: 'helius.dev', name: 'Helius' },
  { domain: 'jup.ag', name: 'Jupiter' },
  { domain: 'anchor-lang.com', name: 'Anchor' },
  { domain: 'solflare.com', name: 'Solflare' },
  { domain: 'backpack.app', name: 'Backpack' },
  { domain: 'metaplex.com', name: 'Metaplex' },
];

export default function EcosystemLogos() {
  return (
    <section className="py-16 bg-dark-card border-y border-dark-lighter">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h3 className="text-center text-sm font-semibold text-gray-500 mb-8 uppercase tracking-wider">
            Powered by Solana Ecosystem
          </h3>
        </AnimatedSection>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
          {ecosystemPartners.map((partner, index) => (
            <AnimatedSection 
              key={partner.domain} 
              animation="scale" 
              delay={index * 100}
            >
              <div 
                className="group relative flex items-center justify-center p-4 rounded-lg hover:bg-dark-lighter transition-all cursor-pointer"
                title={partner.name}
              >
                <BrandLogo
                  domain={partner.domain}
                  alt={partner.name}
                  size={48}
                  className="opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
