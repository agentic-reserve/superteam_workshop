import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a helpful Solana development assistant for a workshop about optimizing Solana fullstack development with Kiro, OpenClaw, and Ollama.

Your expertise includes:
- Solana blockchain development (programs, transactions, accounts)
- Anchor framework for Solana programs
- @solana/kit SDK and @solana/web3.js
- Helius RPC and APIs (DAS API, webhooks, priority fees)
- Jupiter integration (swaps, DCA, limit orders)
- Kiro AI IDE (skills, hooks, specs, steering)
- OpenClaw multi-platform AI agent
- Ollama local and cloud models
- React/Next.js frontend development
- Wallet integration (Phantom, Solflare)
- Testing with LiteSVM, Mollusk, Surfpool
- Deployment and production best practices

Provide clear, concise, and practical answers. Include code examples when relevant. Focus on helping developers build Solana dApps efficiently.

If asked about topics outside Solana development, politely redirect to Solana-related questions.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Build messages array with system prompt and history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Superteam Workshop - Solana Development'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
      role: 'assistant'
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
