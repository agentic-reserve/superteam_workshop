'use client';

import { useState } from 'react';
import MaterialIcon from './MaterialIcon';

interface AuditResult {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  summary: string;
  checks: Array<{
    tool: string;
    status: 'pass' | 'warning' | 'error';
    message: string;
    details?: string[];
    recommendation?: string;
  }>;
  score: number;
  recommendations: string[];
  timestamp: string;
}

export default function CodeAuditor() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'rust' | 'typescript'>('rust');
  const [checkType, setCheckType] = useState<'security' | 'performance' | 'best-practices' | 'full'>('security');
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');

  const handleAudit = async () => {
    if (!code.trim()) {
      setError('Please enter code to audit');
      return;
    }

    setIsAuditing(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          checkType,
        }),
      });

      if (!response.ok) {
        throw new Error('Audit failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to perform audit. Please try again.');
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-400';
      default:
        return 'text-primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
            <MaterialIcon icon="security" size={32} className="text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">AI Security Auditor</h2>
        <p className="text-gray-400">
          Audit Solana smart contracts dengan AI-powered security analysis
        </p>
      </div>

      {/* Configuration */}
      <div className="card">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'rust' | 'typescript')}
              className="w-full bg-dark-bg border border-dark-lighter rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary"
            >
              <option value="rust">Rust (Anchor/Native)</option>
              <option value="typescript">TypeScript (Client)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Check Type</label>
            <select
              value={checkType}
              onChange={(e) => setCheckType(e.target.value as any)}
              className="w-full bg-dark-bg border border-dark-lighter rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary"
            >
              <option value="security">Security</option>
              <option value="performance">Performance</option>
              <option value="best-practices">Best Practices</option>
              <option value="full">Full Audit</option>
            </select>
          </div>
        </div>

        {/* Code Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Code to Audit</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your ${language} code here...`}
            className="w-full h-64 bg-dark-bg border border-dark-lighter rounded-lg px-4 py-3 text-dark-text font-mono text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Audit Button */}
        <button
          onClick={handleAudit}
          disabled={isAuditing || !code.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuditing ? (
            <>
              <MaterialIcon icon="hourglass_empty" size={20} className="animate-spin" />
              Analyzing Code...
            </>
          ) : (
            <>
              <MaterialIcon icon="security" size={20} />
              Run Security Audit
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
            <MaterialIcon icon="error" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">Audit Results</h3>
                <p className="text-gray-400">{result.summary}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary mb-1">{result.score}/100</div>
                <div className={`text-sm font-semibold ${getSeverityColor(result.severity)}`}>
                  {result.severity.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-dark-bg rounded-full h-3 mb-4">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${result.score}%` }}
              />
            </div>

            <div className="text-xs text-gray-500">
              Audited on {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Security Checks */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MaterialIcon icon="checklist" size={24} className="text-primary" />
              Security Checks
            </h3>
            <div className="space-y-3">
              {result.checks.map((check, index) => (
                <div
                  key={index}
                  className="bg-dark-bg rounded-lg p-4 border border-dark-lighter"
                >
                  <div className="flex items-start gap-3">
                    <MaterialIcon
                      icon={getStatusIcon(check.status)}
                      size={24}
                      className={`${getStatusColor(check.status)} flex-shrink-0 mt-0.5`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{check.tool}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(check.status)} bg-opacity-20`}>
                          {check.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{check.message}</p>
                      
                      {check.details && check.details.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 mb-2">
                          {check.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      )}
                      
                      {check.recommendation && (
                        <div className="mt-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MaterialIcon icon="lightbulb" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-primary">{check.recommendation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MaterialIcon icon="recommend" size={24} className="text-primary" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <MaterialIcon icon="arrow_right" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tools Used */}
          <div className="card bg-dark-bg border border-primary/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <MaterialIcon icon="build" size={20} className="text-primary" />
              Security Tools Used
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div className="text-center">
                <MaterialIcon icon="bug_report" size={24} className="text-primary mx-auto mb-1" />
                <div className="text-gray-400">Trident</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="verified_user" size={24} className="text-primary mx-auto mb-1" />
                <div className="text-gray-400">Vipers</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="shield" size={24} className="text-primary mx-auto mb-1" />
                <div className="text-gray-400">cargo-audit</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="science" size={24} className="text-primary mx-auto mb-1" />
                <div className="text-gray-400">cargo-geiger</div>
              </div>
              <div className="text-center">
                <MaterialIcon icon="calculate" size={24} className="text-primary mx-auto mb-1" />
                <div className="text-gray-400">checked-math</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
