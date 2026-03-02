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
    id: '09',
    title: 'OpenClaw Integration',
    description: 'Multi-platform AI agent untuk team collaboration dan automation',
    duration: '2 jam',
    level: 'Intermediate',
    icon: 'hub',
    topics: ['Multi-Platform', 'Webhooks', 'Automation', 'Team Collaboration', 'Ollama Integration'],
    folderPath: '09-openclaw-integration'
  },
  {
    id: '10',
    title: 'MagicBlock Ephemeral Rollups',
    description: 'High-performance Solana dengan sub-10ms latency dan gasless transactions',
    duration: '2 jam',
    level: 'Advanced',
    icon: 'flash_on',
    topics: ['Ephemeral Rollups', 'Delegation', 'VRF', 'Crank', 'Real-time Games'],
    folderPath: '10-magicblock'
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
  },
  {
    id: '13',
    title: 'Pitch Deck Design',
    description: 'Cara membuat pitch deck yang memorable untuk Solana projects',
    duration: '1 jam',
    level: 'Beginner',
    icon: 'slideshow',
    topics: ['Legibility', 'Simplicity', 'Obviousness', 'Demo Day', 'Investor Pitches'],
    folderPath: '13-pitch-deck-design'
  },
  {
    id: '14',
    title: 'Helius APIs & Infrastructure',
    description: 'Complete Solana developer platform: RPCs, DAS API, webhooks, dan streaming',
    duration: '2 jam',
    level: 'Intermediate',
    icon: 'cloud',
    topics: ['RPC Nodes', 'DAS API', 'Webhooks', 'Priority Fees', 'Helius Sender', 'LaserStream'],
    folderPath: '14-helius-apis'
  },
  {
    id: '15',
    title: 'Solana Mobile Development',
    description: 'Build mobile dApps dengan Mobile Wallet Adapter dan publish ke dApp Store',
    duration: '2.5 jam',
    level: 'Intermediate',
    icon: 'phone_android',
    topics: ['Mobile Wallet Adapter', 'React Native', 'Kotlin', 'Flutter', 'dApp Store', 'PWA'],
    folderPath: '15-solana-mobile'
  },
  {
    id: '16',
    title: 'Solana eBPF Decompilation',
    description: 'Reverse engineering dan security analysis untuk Solana programs dengan Ghidra',
    duration: '2 jam',
    level: 'Advanced',
    icon: 'bug_report',
    topics: ['Ghidra', 'eBPF', 'Reverse Engineering', 'Security Audit', 'Decompilation'],
    folderPath: '16-ebpf-ghidra'
  },
  {
    id: '17',
    title: 'Trident Fuzzing Framework',
    description: 'Manually-guided fuzzing untuk menemukan bugs dan vulnerabilities, processing 12,000 tx/s',
    duration: '2.5 jam',
    level: 'Advanced',
    icon: 'pest_control',
    topics: ['Fuzzing', 'Property Testing', 'Stateful Testing', 'Security', 'CI/CD'],
    folderPath: '17-trident-fuzzing'
  }
];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getModulePath(id: string): string {
  const module = getModuleById(id);
  return module ? `../${module.folderPath}` : '';
}
