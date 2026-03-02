// Progress tracking using localStorage
export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent?: number; // in seconds
}

export interface UserProgress {
  modules: Record<string, ModuleProgress>;
  totalTimeSpent: number;
  lastVisited?: Date;
}

const STORAGE_KEY = 'solana-workshop-progress';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return { modules: {}, totalTimeSpent: 0 };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { modules: {}, totalTimeSpent: 0 };
    
    const progress = JSON.parse(stored);
    // Convert date strings back to Date objects
    if (progress.lastVisited) {
      progress.lastVisited = new Date(progress.lastVisited);
    }
    Object.values(progress.modules).forEach((module: any) => {
      if (module.startedAt) module.startedAt = new Date(module.startedAt);
      if (module.completedAt) module.completedAt = new Date(module.completedAt);
    });
    
    return progress;
  } catch (error) {
    console.error('Error loading progress:', error);
    return { modules: {}, totalTimeSpent: 0 };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function markModuleStarted(moduleId: string): void {
  const progress = getProgress();
  
  if (!progress.modules[moduleId]) {
    progress.modules[moduleId] = {
      moduleId,
      completed: false,
      startedAt: new Date(),
    };
  }
  
  progress.lastVisited = new Date();
  saveProgress(progress);
}

export function markModuleCompleted(moduleId: string): void {
  const progress = getProgress();
  
  if (!progress.modules[moduleId]) {
    progress.modules[moduleId] = {
      moduleId,
      completed: false,
      startedAt: new Date(),
    };
  }
  
  progress.modules[moduleId].completed = true;
  progress.modules[moduleId].completedAt = new Date();
  progress.lastVisited = new Date();
  
  saveProgress(progress);
}

export function updateTimeSpent(moduleId: string, seconds: number): void {
  const progress = getProgress();
  
  if (!progress.modules[moduleId]) {
    progress.modules[moduleId] = {
      moduleId,
      completed: false,
      startedAt: new Date(),
      timeSpent: 0,
    };
  }
  
  progress.modules[moduleId].timeSpent = (progress.modules[moduleId].timeSpent || 0) + seconds;
  progress.totalTimeSpent += seconds;
  progress.lastVisited = new Date();
  
  saveProgress(progress);
}

export function getModuleProgress(moduleId: string): ModuleProgress | null {
  const progress = getProgress();
  return progress.modules[moduleId] || null;
}

export function getCompletionPercentage(): number {
  const progress = getProgress();
  const totalModules = 10; // Total workshop modules
  const completedModules = Object.values(progress.modules).filter(m => m.completed).length;
  return Math.round((completedModules / totalModules) * 100);
}

export function getCompletedModulesCount(): number {
  const progress = getProgress();
  return Object.values(progress.modules).filter(m => m.completed).length;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportProgress(): string {
  const progress = getProgress();
  return JSON.stringify(progress, null, 2);
}

export function importProgress(data: string): boolean {
  try {
    const progress = JSON.parse(data);
    saveProgress(progress);
    return true;
  } catch (error) {
    console.error('Error importing progress:', error);
    return false;
  }
}
