'use client';
import { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Send, StopCircle, Trash2 } from 'lucide-react';

export function ChatInterface() {
  const { messages, sendMessage, isLoading, error, clearMessages, stop } = useChat({ api: '/api/chat' });
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-neutral-400 py-12">
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm mt-1">Ask anything — powered by Claude AI</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-neutral-100 px-4 py-2.5 dark:bg-neutral-800">
              <span className="inline-flex gap-1">
                {[0,1,2].map(i => <span key={i} className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
        {error && <p className="mb-2 text-xs text-red-500">{error.message}</p>}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          {isLoading ? (
            <button type="button" onClick={stop} className="rounded-xl bg-red-500 px-3 py-2.5 text-white hover:bg-red-600">
              <StopCircle size={16} />
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="rounded-xl bg-blue-600 px-3 py-2.5 text-white hover:bg-blue-700 disabled:opacity-40">
              <Send size={16} />
            </button>
          )}
          <button type="button" onClick={clearMessages} className="rounded-xl border border-neutral-200 px-3 py-2.5 hover:bg-neutral-50 dark:border-neutral-700">
            <Trash2 size={16} className="text-neutral-400" />
          </button>
        </form>
      </div>
    </div>
  );
}
