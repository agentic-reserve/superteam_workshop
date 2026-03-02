import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { modules } from '@/lib/modules';

export default function ModulesPage() {
  return (
    <div className="py-20 bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
              <MaterialIcon icon="library_books" size={48} className="text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Workshop Modules</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            10 comprehensive modules untuk master Solana development dengan AI-powered tools
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary mb-1">10</div>
            <div className="text-sm text-gray-400">Modules</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-accent mb-1">7h</div>
            <div className="text-sm text-gray-400">Total Time</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-gray-400">Examples</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-accent mb-1">100%</div>
            <div className="text-sm text-gray-400">Hands-on</div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {modules.map((module) => (
            <Link 
              key={module.id}
              href={`/modules/${module.id}`}
              className="card hover:border-primary border-2 border-transparent transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MaterialIcon icon={module.icon} size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Module {module.id}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4">
                {module.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {module.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="text-xs bg-dark-lighter px-2 py-1 rounded text-gray-400">
                    {topic}
                  </span>
                ))}
                {module.topics.length > 3 && (
                  <span className="text-xs bg-dark-lighter px-2 py-1 rounded text-gray-400">
                    +{module.topics.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-gray-500">
                    <MaterialIcon icon="schedule" size={16} />
                    {module.duration}
                  </span>
                  <span className={`flex items-center gap-1 ${
                    module.level === 'Beginner' ? 'text-green-500' :
                    module.level === 'Intermediate' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    <MaterialIcon icon="signal_cellular_alt" size={16} />
                    {module.level}
                  </span>
                </div>
                <MaterialIcon icon="arrow_forward" size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Learning Paths */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Recommended Learning Paths</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <MaterialIcon icon="flash_on" size={24} className="text-primary" />
                <h3 className="text-xl font-bold">Quick Start</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Perfect untuk beginners (2 jam)</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                  Module 01, 07
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                  Quick examples
                </li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <MaterialIcon icon="workspace_premium" size={24} className="text-primary-accent" />
                <h3 className="text-xl font-bold">Comprehensive</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Complete mastery (7 jam)</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" size={16} className="text-primary-accent" />
                  All 10 modules
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" size={16} className="text-primary-accent" />
                  Deep dives
                </li>
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <MaterialIcon icon="diversity_3" size={24} className="text-primary" />
                <h3 className="text-xl font-bold">Team Setup</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">Team collaboration (4 jam)</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                  Module 02, 05, 10
                </li>
                <li className="flex items-center gap-2">
                  <MaterialIcon icon="check_circle" size={16} className="text-primary" />
                  OpenClaw setup
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
