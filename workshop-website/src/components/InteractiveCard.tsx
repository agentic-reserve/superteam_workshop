'use client';

import { ReactNode } from 'react';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
}

export default function InteractiveCard({ children, className = '' }: InteractiveCardProps) {
  return (
    <div
      className={`${className} transition-transform duration-300 hover:scale-105`}
      style={{ transformOrigin: 'center' }}
    >
      {children}
    </div>
  );
}
