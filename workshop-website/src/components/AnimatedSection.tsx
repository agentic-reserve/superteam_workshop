'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedSection({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  duration = 800,
  className = ''
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'none';
            }, delay);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animation, delay, duration]);

  const getInitialStyle = () => {
    switch (animation) {
      case 'slideUp':
        return { opacity: 0, transform: 'translateY(30px)' };
      case 'slideLeft':
        return { opacity: 0, transform: 'translateX(30px)' };
      case 'slideRight':
        return { opacity: 0, transform: 'translateX(-30px)' };
      case 'scale':
        return { opacity: 0, transform: 'scale(0.9)' };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{
        ...getInitialStyle(),
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {children}
    </div>
  );
}
