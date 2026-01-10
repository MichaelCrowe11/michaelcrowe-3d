'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: Action[];
}

interface Action {
  type: 'schedule' | 'purchase' | 'link';
  label: string;
  data?: any;
}

export function AgenticChat({ visible }: { visible: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 1000);
    }
  }, [visible]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickActions = [
    { label: 'Book a consultation', prompt: 'I want to book an AI consultation session' },
    { label: 'View datasets', prompt: 'Show me available datasets and pricing' },
    { label: 'Drug discovery AI', prompt: 'Tell me about your drug discovery AI capabilities' },
  ];

  const sendMessage = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent || isTyping) return;

    setShowWelcome(false);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: messageContent }].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('Failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.choices?.[0]?.delta?.content) {
                  assistantContent += data.choices[0].delta.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = assistantContent;
                    return newMessages;
                  });
                }
              } catch {}
            }
          }
        }
      }

      if (!assistantContent) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = "How can I help you today?";
          return newMessages;
        });
      }
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Connection issue. Email michael@crowelogic.com directly."
      }]);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8"
        >
          {/* Branding - minimal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-8 left-8"
          >
            <h1 className="text-2xl font-light tracking-wide text-white/90">
              michael<span className="text-cyan-400">crowe</span>.ai
            </h1>
          </motion.div>

          {/* Main chat container */}
          <div className="w-full max-w-2xl h-full max-h-[80vh] flex flex-col">
            {/* Welcome state */}
            <AnimatePresence>
              {showWelcome && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-4xl md:text-5xl font-extralight text-white/90 mb-4 leading-tight"
                  >
                    What can I build for you?
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-lg text-white/50 mb-12 max-w-md"
                  >
                    AI consulting, drug discovery, datasets, scheduling — all through conversation.
                  </motion.p>

                  {/* Quick actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    className="flex flex-wrap gap-3 justify-center"
                  >
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(action.prompt)}
                        className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
                      >
                        {action.label}
                      </button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            {messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-y-auto py-8 space-y-6 scrollbar-thin"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30'
                          : 'bg-white/5 border border-white/10'
                      } rounded-2xl px-5 py-3`}
                    >
                      <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </motion.div>
            )}

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="mt-auto"
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all duration-300 pr-14"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>

              <p className="text-center text-white/20 text-xs mt-4">
                Powered by Claude 4.5 Opus
              </p>
            </motion.div>
          </div>

          {/* Minimal footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 flex gap-8 text-white/30 text-sm"
          >
            <a href="mailto:michael@crowelogic.com" className="hover:text-white/60 transition-colors">Contact</a>
            <a href="https://github.com/MichaelCrowe11" className="hover:text-white/60 transition-colors">GitHub</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
