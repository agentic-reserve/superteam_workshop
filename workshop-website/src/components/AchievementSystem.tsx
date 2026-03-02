'use client';

import { useEffect, useState } from 'react';
import AchievementBadge from './AchievementBadge';
import { getCompletedModulesCount } from '@/lib/progress';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: () => boolean;
}

const achievements: Achievement[] = [
  {
    id: 'first-module',
    title: 'First Steps',
    description: 'Completed your first module!',
    icon: 'star',
    color: 'from-yellow-400 to-orange-500',
    condition: () => getCompletedModulesCount() >= 1,
  },
  {
    id: 'three-modules',
    title: 'Getting Started',
    description: 'Completed 3 modules. Keep going!',
    icon: 'local_fire_department',
    color: 'from-orange-400 to-red-500',
    condition: () => getCompletedModulesCount() >= 3,
  },
  {
    id: 'five-modules',
    title: 'Halfway There',
    description: 'Completed 5 modules. You\'re unstoppable!',
    icon: 'trending_up',
    color: 'from-primary to-primary-accent',
    condition: () => getCompletedModulesCount() >= 5,
  },
  {
    id: 'all-modules',
    title: 'Workshop Master',
    description: 'Completed all 10 modules! Amazing work!',
    icon: 'emoji_events',
    color: 'from-primary-accent to-accent-orange',
    condition: () => getCompletedModulesCount() >= 10,
  },
];

export default function AchievementSystem() {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load unlocked achievements from localStorage
    const stored = localStorage.getItem('unlocked-achievements');
    if (stored) {
      setUnlockedAchievements(new Set(JSON.parse(stored)));
    }

    // Listen for module completion events
    const handleModuleCompleted = () => {
      checkAchievements();
    };

    window.addEventListener('module-completed', handleModuleCompleted);
    
    return () => {
      window.removeEventListener('module-completed', handleModuleCompleted);
    };
  }, []);

  const checkAchievements = () => {
    for (const achievement of achievements) {
      if (!unlockedAchievements.has(achievement.id) && achievement.condition()) {
        unlockAchievement(achievement);
        break; // Show one at a time
      }
    }
  };

  const unlockAchievement = (achievement: Achievement) => {
    const newUnlocked = new Set(unlockedAchievements);
    newUnlocked.add(achievement.id);
    setUnlockedAchievements(newUnlocked);
    localStorage.setItem('unlocked-achievements', JSON.stringify(Array.from(newUnlocked)));
    
    setCurrentAchievement(achievement);
  };

  const handleClose = () => {
    setCurrentAchievement(null);
  };

  return (
    <>
      {currentAchievement && (
        <AchievementBadge achievement={currentAchievement} onClose={handleClose} />
      )}
    </>
  );
}
