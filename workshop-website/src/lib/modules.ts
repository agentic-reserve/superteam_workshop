export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  topics: string[];
  folderPath: string;
}

export const modules: Module[] = [
  {
    id: '01',
    title: 'Skills Solana',
    description: 'Activate Solana development skills untuk instant expertise',
    duration: '30 menit',
    level: 'Beginner',
    icon: 'school',
    topics: ['Solana Skills', 'Helius', 'Jupiter', 'Light Protocol', 'MagicBlock'],
    folderPath: '01-skills-solana'
  },
  {
    id: '02',
    title: 'Hooks & Automation',
    description: 'Automate workflows dengan event-driven hooks',
    duration: '45 menit',
    level: 'Beginner',
    icon: 'webhook',
    topics: ['File Hooks', 'Git Hooks', 'Test Automation', 'Deployment Hooks'],
    folderPath: '02-hooks'
  },
  {
    id: '03',
    title: 'Specs & Planning',
    description: 'Structured planning untuk complex features',
    duration: '45 menit',
    level: 'Intermediate',
    icon: 'assignment',
    topics: ['Spec Creation', 'Task Management', 'AI Collaboration', 'Documentation'],
    folderPath: '02-specs-solana'
  },
  {
    id: '04',
    title: 'Workflow Optimization',
    description: 'Optimize development workflow untuk maximum productivity',
    duration: '1 jam',
    level: 'Intermediate',
    icon: 'speed',
    topics: ['Flow State', 'Context Management', 'Parallel Development', 'Quick Iterations'],
    folderPath: '02-workflow-optimization'
  },
  {
    id: '05',
    title: 'Steering Rules',
    description: 'Custom instructions untuk consistent code quality',
    duration: '30 menit',
    level: 'Intermediate',
    icon: 'rule',
    topics: ['Code Standards', 'Team Conventions', 'Auto-inclusion', 'File Matching'],
    folderPath: '03-steering'
  },
  {
    id: '06',
    title: 'MCP Integration',
    description: 'Extend Kiro dengan Model Context Protocol',
    duration: '45 menit',
    level: 'Advanced',
    icon: 'extension',
    topics: ['MCP Servers', 'Custom Tools', 'AWS Integration', 'Database Access'],
    folderPath: '04-mcp'
  },
  {
    id: '07',
    title: 'Complete Setup',
    description: 'Full development environment setup',
    duration: '1 jam',
    level: 'Beginner',
    icon: 'settings',
    topics: ['Environment Setup', 'Tool Installation', 'Configuration', 'Verification'],
    folderPath: '06-complete-setup'
  },
  {
    id: '08',
    title: 'Modern Workflow',
    description: 'Modern development practices untuk Solana',
    duration: '1 jam',
    level: 'Intermediate',
    icon: 'trending_up',
    topics: ['Testing Strategy', 'CI/CD', 'Code Review', 'Performance'],
    folderPath: '07-modern-workflow'
  },
  {
    id: '09',
    title: 'Deployment',
    description: 'Deploy Solana programs dan dApps to production',
    duration: '1 jam',
    level: 'Advanced',
    icon: 'rocket_launch',
    topics: ['Program Deployment', 'Frontend Hosting', 'Monitoring', 'Maintenance'],
    folderPath: '08-deployment'
  },
  {
    id: '10',
    title: 'OpenClaw Integration',
    description: 'Multi-platform notifications dan team collaboration',
    duration: '1 jam',
    level: 'Advanced',
    icon: 'notifications_active',
    topics: ['Slack/Discord/Telegram', 'Automation', 'Team Workflows', 'Ollama Setup'],
    folderPath: '09-openclaw-integration'
  },
  {
    id: '11',
    title: 'Sipher - Privacy for Agents',
    description: 'Privacy-as-a-Skill untuk multi-chain autonomous agents',
    duration: '1.5 jam',
    level: 'Advanced',
    icon: 'shield',
    topics: ['Stealth Addresses', 'Pedersen Commitments', 'Viewing Keys', 'Shielded Transfers', '17 Chains'],
    folderPath: '11-sipher-privacy'
  },
  {
    id: '12',
    title: 'OpenRouter AI Agents',
    description: 'Build modular AI agents dengan akses ke 300+ language models',
    duration: '2 jam',
    level: 'Advanced',
    icon: 'smart_toy',
    topics: ['OpenRouter SDK', 'Items Streaming', 'Multi-Modal Embeddings', 'Agent Hooks', 'Model Discovery'],
    folderPath: '12-openrouter-agents'
  }
];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getModulePath(id: string): string {
  const module = getModuleById(id);
  return module ? `../${module.folderPath}` : '';
}
