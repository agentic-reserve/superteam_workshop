'use client';

import { useEffect, useState } from 'react';
import MaterialIcon from './MaterialIcon';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementBadge({ achievement, onClose }: AchievementBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-24 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-dark-card border-2 border-primary rounded-xl shadow-2xl shadow-primary/20 p-6 max-w-sm">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center flex-shrink-0 animate-bounce`}>
            <MaterialIcon icon={achievement.icon} size={32} className="text-dark-bg" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-primary font-semibold mb-1">🎉 Achievement Unlocked!</div>
                <h3 className="font-bold text-lg">{achievement.title}</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-dark-text transition-colors"
                aria-label="Close"
              >
                <MaterialIcon icon="close" size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-400">{achievement.description}</p>
          </div>
        </div>
        
        {/* Progress bar animation */}
        <div className="mt-4 h-1 bg-dark-lighter rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-accent"
            style={{
              animation: 'progress 5s linear forwards'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
