import CodeAuditor from '@/components/CodeAuditor';

export const metadata = {
  title: 'AI Security Auditor - Solana Workshop',
  description: 'Audit your Solana smart contracts with AI-powered security analysis',
};

export default function AuditPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <CodeAuditor />
        
        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold mb-3">Apa yang Diaudit?</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Integer overflow/underflow vulnerabilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Missing signer dan owner checks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Unvalidated account inputs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Reentrancy vulnerabilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>PDA derivation issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Unsafe Rust code patterns</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-3">Security Tools</h3>
            <div className="space-y-3 text-gray-400">
              <div>
                <div className="font-semibold text-primary mb-1">Trident</div>
                <div className="text-sm">Fuzzing framework untuk Solana programs (12K tx/s)</div>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">Vipers</div>
                <div className="text-sm">Validation checks untuk safer Solana programs</div>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">cargo-audit</div>
                <div className="text-sm">Scan dependencies untuk known vulnerabilities</div>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">cargo-geiger</div>
                <div className="text-sm">Detect unsafe Rust code usage</div>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">checked-math</div>
                <div className="text-sm">Verify overflow/underflow handling</div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-6 card bg-primary/10 border border-primary/30">
          <h3 className="text-xl font-bold mb-3 text-primary">💡 Best Practices</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <div className="font-semibold mb-2">Before Deployment:</div>
              <ul className="space-y-1 text-gray-400">
                <li>• Run full security audit</li>
                <li>• Test dengan Trident fuzzing</li>
                <li>• Check semua dependencies</li>
                <li>• Review unsafe code blocks</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2">During Development:</div>
              <ul className="space-y-1 text-gray-400">
                <li>• Use checked arithmetic</li>
                <li>• Validate all account inputs</li>
                <li>• Add comprehensive tests</li>
                <li>• Document security assumptions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
