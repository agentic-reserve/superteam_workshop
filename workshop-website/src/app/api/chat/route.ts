import { NextRequest, NextResponse } from 'next/server';
import ollama from 'ollama';

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

    // Build messages array with system prompt and history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    // Call Ollama API
    const response = await ollama.chat({
      model: 'gpt-oss:120b-cloud',
      messages: messages as any,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    });

    return NextResponse.json({
      message: response.message.content,
      role: 'assistant'
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Handle specific Ollama errors
    if (error.message?.includes('model')) {
      return NextResponse.json(
        { error: 'AI model not available. Please ensure Ollama is running with gpt-oss:120b-cloud model.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
