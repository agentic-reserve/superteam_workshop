'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  domain: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: string;
}

export default function BrandLogo({ 
  domain, 
  alt, 
  size = 32, 
  className = '',
  fallback 
}: BrandLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Use Brandfetch Logo API (no API key needed for basic usage)
    const url = `https://img.logo.dev/${domain}?token=pk_demo&size=${size}`;
    setLogoUrl(url);
  }, [domain, size]);

  if (error && fallback) {
    return (
      <img 
        src={fallback} 
        alt={alt}
        width={size}
        height={size}
        className={className}
      />
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-primary/20 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-primary font-bold text-xs">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
