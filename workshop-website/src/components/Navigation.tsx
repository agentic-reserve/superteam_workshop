'use client';

import BubbleMenu from './BubbleMenu';
import Image from 'next/image';

export default function Navigation() {
  const menuItems = [
    {
      label: 'home',
      href: '/',
      ariaLabel: 'Home',
      rotation: -8,
      hoverStyles: { bgColor: '#50A0B4', textColor: '#000000' }
    },
    {
      label: 'modules',
      href: '/modules',
      ariaLabel: 'Modules',
      rotation: 8,
      hoverStyles: { bgColor: '#50A0B4', textColor: '#000000' }
    },
    {
      label: 'audit',
      href: '/audit',
      ariaLabel: 'AI Security Audit',
      rotation: -8,
      hoverStyles: { bgColor: '#50A0B4', textColor: '#000000' }
    },
    {
      label: 'dashboard',
      href: '/dashboard',
      ariaLabel: 'Dashboard',
      rotation: 8,
      hoverStyles: { bgColor: '#50A0B4', textColor: '#000000' }
    },
    {
      label: 'quick start',
      href: '/quick-start',
      ariaLabel: 'Quick Start',
      rotation: -8,
      hoverStyles: { bgColor: '#50A0B4', textColor: '#000000' }
    },
    {
      label: 'reference',
      href: '/quick-reference',
      ariaLabel: 'Quick Reference',
      rotation: 8,
      hoverStyles: { bgColor: '#50A0B4', textColor: '#000000' }
    }
  ];

  return (
    <BubbleMenu
      logo={
        <img 
          src="/LogoHorizontal-White.png" 
          alt="Superteam Indonesia" 
          style={{ maxHeight: '32px', width: 'auto' }}
        />
      }
      items={menuItems}
      menuAriaLabel="Toggle navigation"
      menuBg="#0A0A0A"
      menuContentColor="#FFFFFF"
      useFixedPosition={true}
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
    />
  );
}
