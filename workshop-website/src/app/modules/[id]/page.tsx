import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MaterialIcon from '@/components/MaterialIcon';
import ModuleProgressButton from '@/components/ModuleProgressButton';
import { getModuleById, modules } from '@/lib/modules';

export async function generateStaticParams() {
  return modules.map((module) => ({
    id: module.id,
  }));
}

async function getModuleContent(id: string) {
  const module = getModuleById(id);
  if (!module) return null;

  // Try both paths: inside workshop-website and parent directory
  const paths = [
    path.join(process.cwd(), module.folderPath, 'README.md'),
    path.join(process.cwd(), '..', module.folderPath, 'README.md'),
  ];
  
  for (const readmePath of paths) {
    try {
      const content = fs.readFileSync(readmePath, 'utf8');
      return { module, content };
    } catch (error) {
      // Try next path
      continue;
    }
  }
  
  console.error(`Error reading module ${id} from any path`);
  return { module, content: '# Content not available\n\nModule content is being prepared.' };
}

export default async function ModulePage({ params }: { params: { id: string } }) {
  const data = await getModuleContent(params.id);
  
  if (!data) {
    notFound();
  }

  const { module, content } = data;
  const currentIndex = modules.findIndex(m => m.id === params.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <div className="py-20 bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <MaterialIcon icon="chevron_right" size={16} />
          <Link href="/modules" className="hover:text-primary transition-colors">Modules</Link>
          <MaterialIcon icon="chevron_right" size={16} />
          <span className="text-dark-text">Module {module.id}</span>
        </div>

        {/* Module Header */}
        <div className="card mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <MaterialIcon icon={module.icon} size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">Module {module.id}</div>
              <h1 className="text-4xl font-bold mb-3">{module.title}</h1>
              <p className="text-xl text-gray-400">{module.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MaterialIcon icon="schedule" size={20} className="text-primary" />
              <span>{module.duration}</span>
            </div>
            <div className={`flex items-center gap-2 ${
              module.level === 'Beginner' ? 'text-green-500' :
              module.level === 'Intermediate' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              <MaterialIcon icon="signal_cellular_alt" size={20} />
              <span>{module.level}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {module.topics.map((topic) => (
              <span key={topic} className="text-xs bg-dark-lighter px-3 py-1 rounded-full text-gray-400">
                {topic}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-dark-lighter">
            <ModuleProgressButton moduleId={module.id} />
          </div>
        </div>

        {/* Module Content */}
        <div className="card prose prose-invert prose-primary max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-dark-text" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-dark-text" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-dark-text" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-gray-300 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 text-gray-300 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
              code: ({node, inline, ...props}: any) => 
                inline ? 
                  <code className="bg-dark-bg px-2 py-1 rounded text-primary text-sm" {...props} /> :
                  <code className="block bg-dark-bg p-4 rounded-lg overflow-x-auto text-sm text-primary" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-dark-bg p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
              a: ({node, ...props}) => <a className="text-primary hover:text-primary-accent transition-colors underline" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-400 my-4" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full border border-dark-lighter" {...props} /></div>,
              th: ({node, ...props}) => <th className="border border-dark-lighter px-4 py-2 bg-dark-card text-left" {...props} />,
              td: ({node, ...props}) => <td className="border border-dark-lighter px-4 py-2" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {prevModule ? (
            <Link 
              href={`/modules/${prevModule.id}`}
              className="card hover:border-primary border-2 border-transparent transition-all group"
            >
              <div className="flex items-center gap-3">
                <MaterialIcon icon="arrow_back" size={24} className="text-primary group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-sm text-gray-500">Previous</div>
                  <div className="font-bold">{prevModule.title}</div>
                </div>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
          
          {nextModule && (
            <Link 
              href={`/modules/${nextModule.id}`}
              className="card hover:border-primary border-2 border-transparent transition-all group text-right"
            >
              <div className="flex items-center justify-end gap-3">
                <div>
                  <div className="text-sm text-gray-500">Next</div>
                  <div className="font-bold">{nextModule.title}</div>
                </div>
                <MaterialIcon icon="arrow_forward" size={24} className="text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>

        {/* Back to Modules */}
        <div className="mt-8 text-center">
          <Link href="/modules" className="btn-secondary inline-flex items-center gap-2">
            <MaterialIcon icon="grid_view" size={20} />
            Back to All Modules
          </Link>
        </div>
      </div>
    </div>
  );
}
