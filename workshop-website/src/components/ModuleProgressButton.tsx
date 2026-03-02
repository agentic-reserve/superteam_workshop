'use client';

import { useState, useEffect } from 'react';
import MaterialIcon from './MaterialIcon';
import { getModuleProgress, markModuleCompleted, markModuleStarted } from '@/lib/progress';

interface ModuleProgressButtonProps {
  moduleId: string;
}

export default function ModuleProgressButton({ moduleId }: ModuleProgressButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const progress = getModuleProgress(moduleId);
    setIsCompleted(progress?.completed || false);
    setIsStarted(!!progress);
    
    if (!progress) {
      markModuleStarted(moduleId);
      setIsStarted(true);
    }
  }, [moduleId]);

  const handleToggleComplete = () => {
    if (!isCompleted) {
      markModuleCompleted(moduleId);
      setIsCompleted(true);
      
      // Show celebration
      if (typeof window !== 'undefined') {
        // Simple confetti effect or notification
        const event = new CustomEvent('module-completed', { detail: { moduleId } });
        window.dispatchEvent(event);
      }
    }
  };

  return (
    <button
      onClick={handleToggleComplete}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        isCompleted
          ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30'
          : 'bg-primary/20 text-primary border-2 border-primary/30 hover:bg-primary/30'
      }`}
    >
      <MaterialIcon 
        icon={isCompleted ? "check_circle" : "radio_button_unchecked"} 
        size={20} 
      />
      <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
    </button>
  );
}
