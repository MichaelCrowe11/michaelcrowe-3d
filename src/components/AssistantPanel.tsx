'use client';

/* The assistant for michaelcrowe.ai. A glass panel, grounded in the verified
   record, streaming from /api/chat. Not an orb, not a hard-sell bot. */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'What has Michael actually built?',
  'Explain CriOS Nova in one paragraph.',
  'What is Crowe Sense and what is real today?',
  'How do I work with Michael?',
];

export function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const send = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...messages, { role: 'user' as const, content: q }];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error('unavailable');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const data = t.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: 'assistant', content: acc };
                return copy;
              });
            }
          } catch { /* partial json, ignore */ }
        }
      }
      if (!acc) throw new Error('empty');
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          content: 'The assistant is offline right now. Reach Michael directly at michael@crowelogic.com.',
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }, [messages, busy]);

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 btn-glass px-5 py-3 text-sm group"
        aria-label="Ask the assistant"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cool)] animate-pulse" />
        Ask the record
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed z-50 bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[78vh] sm:h-[600px] signal-card flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--accent-cool)] shadow-[var(--glow-cool)]" />
                  <div>
                    <p className="text-sm font-medium text-white leading-none">Ask the record</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mt-1">Grounded in 26 DOI-backed works</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white text-xl leading-none px-2" aria-label="Close">&times;</button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-white/55 leading-relaxed">
                      Ask about the real work: cheminformatics, cultivation telemetry, the research
                      software, or how to collaborate. Answers are grounded in the verified record.
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="text-left text-sm text-white/70 signal-chip px-3.5 py-2.5 hover:text-white hover:border-[color:var(--accent)]/40 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                      <div
                        className={`max-w-[85%] text-sm leading-relaxed rounded-2xl px-4 py-2.5 ${
                          m.role === 'user'
                            ? 'bg-[color:var(--accent)]/15 text-white border border-[color:var(--accent)]/25'
                            : 'bg-white/[0.04] text-white/80 border border-white/10'
                        }`}
                      >
                        {m.content || (busy && i === messages.length - 1 ? <span className="text-white/40">thinking...</span> : '')}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="p-3 border-t border-white/10 flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the work..."
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[color:var(--accent-cool)]/40 transition-colors"
                />
                <button type="submit" disabled={busy || !input.trim()} className="btn-gold h-10 w-10 justify-center rounded-full disabled:opacity-40">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
