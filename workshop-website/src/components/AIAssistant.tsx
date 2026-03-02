'use client';

import { useState, useRef, useEffect } from 'react';
import MaterialIcon from './MaterialIcon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analytics } from '@/lib/analytics';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // Track analytics
    analytics.aiMessageSent(userMessage.length);
    
    setInput('');
    setError(null);

    const newMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setError(err.message);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleSuggestedQuestion = (question: string) => {
    analytics.aiSuggestedQuestionClicked(question);
    setInput(question);
    inputRef.current?.focus();
  };

  const suggestedQuestions = [
    {
      icon: 'settings',
      text: "How do I setup Kiro for Solana development?",
      category: "Setup"
    },
    {
      icon: 'compare',
      text: "What's the difference between Anchor and Pinocchio?",
      category: "Frameworks"
    },
    {
      icon: 'swap_horiz',
      text: "How do I integrate Jupiter swap in my dApp?",
      category: "Integration"
    },
    {
      icon: 'webhook',
      text: "Explain Helius webhooks for transaction monitoring",
      category: "Infrastructure"
    },
    {
      icon: 'compress',
      text: "How does Light Protocol ZK Compression work?",
      category: "Advanced"
    },
    {
      icon: 'speed',
      text: "What are MagicBlock Ephemeral Rollups?",
      category: "Advanced"
    },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30 text-dark-bg rounded-full shadow-xl transition-all z-50 flex items-center justify-center group hover:scale-110"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <MaterialIcon icon="close" size={28} />
        ) : (
          <>
            <MaterialIcon icon="smart_toy" size={28} className="group-hover:scale-110 transition-transform" />
            {messages.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-accent rounded-full flex items-center justify-center text-xs font-bold">
                {messages.length}
              </div>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-[420px] bg-dark-card border border-dark-lighter rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all ${
          isMinimized ? 'h-16' : 'h-[650px]'
        }`}>
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between cursor-pointer"
               onClick={() => setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dark-bg/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MaterialIcon icon="smart_toy" size={24} className="text-dark-bg" />
              </div>
              <div>
                <h3 className="font-bold text-dark-bg">Solana AI Assistant</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-dark-bg/60 rounded-full animate-pulse" />
                  <p className="text-xs text-dark-bg/80">Powered by Ollama</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearChat();
                }}
                className="text-dark-bg/80 hover:text-dark-bg hover:bg-dark-bg/20 p-2 rounded-lg transition-colors"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <MaterialIcon icon="delete" size={20} />
              </button>
              <button
                className="text-dark-bg/80 hover:text-dark-bg p-2 rounded-lg transition-colors"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                <MaterialIcon icon={isMinimized ? "expand_less" : "expand_more"} size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg/50">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MaterialIcon icon="chat" size={40} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Hi! I'm your Solana AI Assistant 👋</h4>
                    <p className="text-sm text-gray-400 mb-6 px-4">
                      Ask me anything about Solana development, Kiro, OpenClaw, or the technologies in this workshop.
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-semibold mb-3">Popular Questions:</p>
                      {suggestedQuestions.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestedQuestion(question.text)}
                          className="block w-full text-left bg-dark-card hover:bg-dark-lighter p-3 rounded-lg transition-all group border border-dark-lighter hover:border-primary/30"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <MaterialIcon icon={question.icon} size={16} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-primary mb-1">{question.category}</div>
                              <div className="text-sm text-gray-300 group-hover:text-primary transition-colors">
                                {question.text}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <MaterialIcon icon="smart_toy" size={16} className="text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[75%]">
                      <div
                        className={`rounded-2xl p-4 overflow-hidden ${
                          msg.role === 'user'
                            ? 'bg-primary text-dark-bg'
                            : 'bg-dark-card text-gray-300 border border-dark-lighter'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm prose-invert max-w-none overflow-hidden">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed break-words" {...props} />,
                                code: ({ node, inline, ...props }: any) =>
                                  inline ? (
                                    <code className="bg-dark-bg/50 px-1.5 py-0.5 rounded text-primary text-xs font-mono break-all" {...props} />
                                  ) : (
                                    <code className="block bg-dark-bg/50 p-3 rounded-lg text-xs overflow-x-auto font-mono border border-dark-lighter whitespace-pre-wrap break-words" {...props} />
                                  ),
                                pre: ({ node, ...props }) => <pre className="overflow-x-auto max-w-full" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1 break-words" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1 break-words" {...props} />,
                                li: ({ node, ...props }) => <li className="break-words" {...props} />,
                                a: ({ node, ...props }) => <a className="text-primary hover:text-primary-accent underline break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                                strong: ({ node, ...props }) => <strong className="text-primary font-semibold" {...props} />,
                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 break-words" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 break-words" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 break-words" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-primary pl-2 italic text-gray-400 break-words" {...props} />,
                                table: ({ node, ...props }) => <div className="overflow-x-auto"><table className="text-xs" {...props} /></div>,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 bg-primary-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <MaterialIcon icon="person" size={16} className="text-primary-accent" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MaterialIcon icon="smart_toy" size={16} className="text-primary" />
                    </div>
                    <div className="bg-dark-card rounded-2xl p-4 border border-dark-lighter">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <MaterialIcon icon="error" size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-400 mb-1">Oops! Something went wrong</p>
                      <p className="text-red-300/80">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="text-xs text-red-400 hover:text-red-300 mt-2 underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-dark-lighter bg-dark-card">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about Solana, Kiro, OpenClaw..."
                      className="w-full bg-dark-bg text-dark-text rounded-xl px-4 py-3 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 border border-dark-lighter placeholder:text-gray-500"
                      rows={1}
                      disabled={isLoading}
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px',
                      }}
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                      {input.length}/500
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-primary hover:bg-primary-light hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none text-dark-bg rounded-xl px-5 flex items-center justify-center transition-all hover:scale-105 disabled:hover:scale-100"
                    aria-label="Send message"
                  >
                    <MaterialIcon icon={isLoading ? "hourglass_empty" : "send"} size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    <kbd className="px-1.5 py-0.5 bg-dark-lighter rounded text-xs">Enter</kbd> to send, 
                    <kbd className="px-1.5 py-0.5 bg-dark-lighter rounded text-xs ml-1">Shift+Enter</kbd> for new line
                  </p>
                  <p className="text-xs text-gray-500">
                    {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
