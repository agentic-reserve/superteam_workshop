import MaterialIcon from '@/components/MaterialIcon';

export default function QuickReferencePage() {
  return (
    <div className="py-20 bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
              <MaterialIcon icon="description" size={48} className="text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Quick Reference</h1>
          <p className="text-xl text-gray-400">
            Cheat sheet untuk common commands dan workflows
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Kiro Commands */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon icon="terminal" size={24} className="text-primary" />
              <h2 className="text-2xl font-bold">Kiro Commands</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Activate Skill</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  Cmd/Ctrl + Shift + P → "Activate Skill"
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Create Hook</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  Cmd/Ctrl + Shift + P → "Create Hook"
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Create Spec</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  Cmd/Ctrl + Shift + P → "Create Spec"
                </div>
              </div>
            </div>
          </div>

          {/* Solana CLI */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon icon="code" size={24} className="text-primary-accent" />
              <h2 className="text-2xl font-bold">Solana CLI</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Check Balance</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary-accent">
                  solana balance
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Airdrop SOL (Devnet)</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary-accent">
                  solana airdrop 2
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Set Cluster</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary-accent">
                  solana config set --url devnet
                </div>
              </div>
            </div>
          </div>

          {/* Anchor Commands */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon icon="anchor" size={24} className="text-primary" />
              <h2 className="text-2xl font-bold">Anchor</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Init Project</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  anchor init my-project
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Build</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  anchor build
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Test</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  anchor test
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Deploy</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  anchor deploy
                </div>
              </div>
            </div>
          </div>

          {/* OpenClaw */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon icon="notifications_active" size={24} className="text-primary-accent" />
              <h2 className="text-2xl font-bold">OpenClaw</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Install</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary-accent">
                  npm install -g openclaw
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Init Config</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary-accent">
                  openclaw init
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Send Notification</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary-accent">
                  openclaw send "Message"
                </div>
              </div>
            </div>
          </div>

          {/* Ollama */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon icon="smart_toy" size={24} className="text-primary" />
              <h2 className="text-2xl font-bold">Ollama</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Pull Model</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  ollama pull glm-4.7-flash
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">List Models</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  ollama list
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Run Model</div>
                <div className="bg-dark-bg p-3 rounded font-mono text-sm text-primary">
                  ollama run glm-4.7-flash
                </div>
              </div>
            </div>
          </div>

          {/* Git Hooks */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon icon="webhook" size={24} className="text-primary-accent" />
              <h2 className="text-2xl font-bold">Common Hooks</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-dark-bg p-3 rounded">
                <div className="text-gray-500 mb-1">Pre-commit: Run tests</div>
                <div className="font-mono text-primary-accent">
                  fileEdited → runCommand → npm test
                </div>
              </div>
              <div className="bg-dark-bg p-3 rounded">
                <div className="text-gray-500 mb-1">Post-deploy: Notify team</div>
                <div className="font-mono text-primary-accent">
                  agentStop → runCommand → openclaw send
                </div>
              </div>
              <div className="bg-dark-bg p-3 rounded">
                <div className="text-gray-500 mb-1">Pre-build: Check lint</div>
                <div className="font-mono text-primary-accent">
                  promptSubmit → askAgent → "Run lint"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="card mt-8 bg-primary border-primary">
          <div className="flex items-start gap-4">
            <MaterialIcon icon="lightbulb" size={32} className="text-dark-bg flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold mb-4 text-dark-bg">Pro Tips</h3>
              <div className="grid md:grid-cols-2 gap-4 text-dark-bg">
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Use Kiro skills untuk instant expertise di Solana ecosystem</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Setup hooks untuk automate repetitive tasks</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Use OpenClaw untuk team notifications dan collaboration</span>
                </div>
                <div className="flex items-start gap-2">
                  <MaterialIcon icon="check_circle" size={20} className="flex-shrink-0 mt-0.5" />
                  <span>Ollama local models save costs untuk development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
