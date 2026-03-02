import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface AuditRequest {
  code: string;
  language: 'rust' | 'typescript';
  checkType: 'security' | 'performance' | 'best-practices' | 'full';
}

interface SecurityCheck {
  tool: string;
  status: 'pass' | 'warning' | 'error';
  message: string;
  details?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { code, language, checkType }: AuditRequest = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Perform AI-powered security audit
    const auditResults = await performAudit(code, language, checkType);

    return NextResponse.json(auditResults);
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Failed to perform audit' },
      { status: 500 }
    );
  }
}

async function performAudit(
  code: string,
  language: string,
  checkType: string
) {
  const systemPrompt = buildSystemPrompt(language, checkType);
  
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-OpenRouter-Title': 'Solana Workshop Audit',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Analyze this ${language} code for security vulnerabilities and best practices:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  const aiAnalysis = data.choices[0].message.content;

  // Parse AI response and structure results
  return parseAuditResults(aiAnalysis, language, checkType);
}

function buildSystemPrompt(language: string, checkType: string): string {
  const basePrompt = `You are an expert Solana security auditor specializing in ${language} code analysis.`;

  const toolsContext = `
You have expertise in the following security tools and frameworks:

1. **Trident Fuzzing Framework**:
   - Manually-guided fuzzing for Solana programs
   - Stateful fuzzing with 12,000 tx/s processing
   - Property-based testing and flow-based sequence control
   - Check for: overflow, underflow, missing constraints, edge cases

2. **Vipers Validation Library**:
   - Assorted checks for safer Solana programs
   - Account struct validation and invariant checking
   - Excessive safety checks (Solana's fee model allows this)

3. **cargo-audit**:
   - Scan for known vulnerabilities in dependencies
   - Check Cargo.lock for security advisories

4. **cargo-geiger**:
   - Detect unsafe Rust code usage
   - Identify potential memory safety issues

5. **checked-math**:
   - Verify proper overflow/underflow handling
   - Ensure checked arithmetic operations
`;

  const checkTypeContext = {
    security: `Focus on:
- Integer overflow/underflow vulnerabilities
- Missing signer checks
- Missing owner checks
- Unvalidated account inputs
- Reentrancy vulnerabilities
- PDA derivation issues
- Unsafe Rust usage
- Known CVEs in dependencies`,
    
    performance: `Focus on:
- Compute unit optimization
- Account size optimization
- Unnecessary allocations
- Inefficient data structures
- CPI call optimization`,
    
    'best-practices': `Focus on:
- Anchor best practices
- Error handling patterns
- Code organization
- Documentation quality
- Test coverage`,
    
    full: `Perform comprehensive analysis covering security, performance, and best practices.`,
  };

  return `${basePrompt}

${toolsContext}

${checkTypeContext[checkType as keyof typeof checkTypeContext]}

Provide your analysis in the following JSON format:
{
  "severity": "critical" | "high" | "medium" | "low" | "info",
  "summary": "Brief overview of findings",
  "checks": [
    {
      "tool": "tool name",
      "status": "pass" | "warning" | "error",
      "message": "Finding description",
      "details": ["detail 1", "detail 2"],
      "recommendation": "How to fix"
    }
  ],
  "score": 0-100,
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;
}

function parseAuditResults(aiAnalysis: string, language: string, checkType: string) {
  try {
    // Try to extract JSON from AI response
    const jsonMatch = aiAnalysis.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        language,
        checkType,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.error('Failed to parse AI response as JSON:', e);
  }

  // Fallback: return structured response from text analysis
  return {
    severity: 'info',
    summary: 'Analysis completed',
    checks: [
      {
        tool: 'AI Analysis',
        status: 'info',
        message: aiAnalysis,
        details: [],
        recommendation: 'Review the analysis above',
      },
    ],
    score: 75,
    recommendations: ['Review AI analysis for detailed findings'],
    language,
    checkType,
    timestamp: new Date().toISOString(),
  };
}
