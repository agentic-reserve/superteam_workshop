import MaterialIcon from '@/components/MaterialIcon';

export default function QuickStartPage() {
  return (
    <div className="py-20 bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-accent/20 rounded-2xl flex items-center justify-center">
              <MaterialIcon icon="bolt" size={48} className="text-primary-accent" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Quick Start</h1>
          <p className="text-xl text-gray-400">
            Setup dan build first Solana dApp dalam 5 menit
          </p>
        </div>

        {/* Prerequisites */}
        <div className="card mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon icon="checklist" size={24} className="text-primary" />
            <h2 className="text-2xl font-bold">Prerequisites</h2>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <MaterialIcon icon="check_circle" size={20} className="text-primary mt-0.5" />
              <span>Node.js 18+ installed</span>
            </li>
            <li className="flex items-start gap-2">
              <MaterialIcon icon="check_circle" size={20} className="text-primary mt-0.5" />
              <span>Kiro IDE installed</span>
            </li>
            <li className="flex items-start gap-2">
              <MaterialIcon icon="check_circle" size={20} className="text-primary mt-0.5" />
              <span>Basic understanding of TypeScript</span>
            </li>
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Install Solana CLI</h3>
                <p className="text-gray-400 mb-4">
                  Install Solana CLI tools untuk development
                </p>
                <div className="bg-dark-bg p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <code className="text-primary">sh -c "$(curl -sSfL https://release.solana.com/stable/install)"</code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Activate Solana Skills</h3>
                <p className="text-gray-400 mb-4">
                  Di Kiro, activate Solana development skills
                </p>
                <div className="bg-dark-bg p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <MaterialIcon icon="keyboard_command_key" size={16} className="text-primary" />
                    <span className="text-sm">Open Command Palette: Cmd/Ctrl + Shift + P</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MaterialIcon icon="search" size={16} className="text-primary" />
                    <span className="text-sm">Search: "Activate Skill"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MaterialIcon icon="check_box" size={16} className="text-primary" />
                    <span className="text-sm">Select: "solana-dev"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Create New Project</h3>
                <p className="text-gray-400 mb-4">
                  Ask Kiro untuk create Solana project
                </p>
                <div className="bg-dark-bg p-4 rounded-lg font-mono text-sm">
                  <div className="text-gray-500 mb-2">// Di Kiro chat:</div>
                  <code className="text-primary">
                    "Create a new Solana counter program with Anchor and a Next.js frontend"
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Build & Deploy</h3>
                <p className="text-gray-400 mb-4">
                  Build program dan deploy ke devnet
                </p>
                <div className="bg-dark-bg p-4 rounded-lg font-mono text-sm space-y-2">
                  <div><code className="text-primary">anchor build</code></div>
                  <div><code className="text-primary">anchor deploy</code></div>
                  <div><code className="text-primary">npm run dev</code></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MaterialIcon icon="celebration" size={20} className="text-primary-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Done! 🎉</h3>
                <p className="text-gray-400 mb-4">
                  Your first Solana dApp is running!
                </p>
                <div className="flex gap-4">
                  <a href="http://localhost:3000" target="_blank" className="btn-primary text-sm inline-flex items-center gap-1">
                    <MaterialIcon icon="open_in_new" size={16} />
                    Open App
                  </a>
                  <a href="/modules" className="btn-secondary text-sm inline-flex items-center gap-1">
                    <MaterialIcon icon="school" size={16} />
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card mt-12 bg-primary border-primary">
          <div className="flex items-start gap-4">
            <MaterialIcon icon="arrow_forward" size={32} className="text-dark-bg" />
            <div>
              <h3 className="text-2xl font-bold mb-2 text-dark-bg">Next Steps</h3>
              <ul className="space-y-2 text-dark-bg">
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="arrow_right" size={20} />
                  <span>Explore Module 02: Setup Hooks untuk automation</span>
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="arrow_right" size={20} />
                  <span>Learn Module 10: Integrate OpenClaw untuk notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="arrow_right" size={20} />
                  <span>Check Quick Reference untuk common commands</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
