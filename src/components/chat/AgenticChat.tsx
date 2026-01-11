'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

function StreamingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current >= text.length) {
      onComplete?.();
      return;
    }

    const speed = Math.random() * 20 + 10; // Variable speed for natural feel
    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, indexRef.current + 1));
      indexRef.current++;
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, onComplete]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible(v => !v);
    }, 400);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span className="relative">
      {displayedText.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, color: '#22d3ee' }}
          animate={{ opacity: 1, color: '#e5e5e5' }}
          transition={{ duration: 0.3 }}
          className="inline"
        >
          {char}
        </motion.span>
      ))}
      {indexRef.current < text.length && (
        <motion.span
          animate={{ opacity: cursorVisible ? 1 : 0 }}
          className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 align-middle shadow-[0_0_10px_#22d3ee,0_0_20px_#22d3ee]"
        />
      )}
    </span>
  );
}

function Avatar({ isAI }: { isAI: boolean }) {
  if (isAI) {
    return (
      <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <img
            src="/crowe-avatar.png"
            alt="Crowe AI"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#030303] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium ring-2 ring-violet-500/30">
      You
    </div>
  );
}

export function AgenticChat({ visible }: { visible: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 1000);
    }
  }, [visible]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const quickActions = [
    { label: 'Book consultation', prompt: 'I want to book an AI consultation' },
    { label: 'See pricing', prompt: 'What are your prices?' },
    { label: 'Drug discovery', prompt: 'Tell me about drug discovery AI' },
    { label: 'View datasets', prompt: 'Show me your datasets' },
  ];

  const sendMessage = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent || isTyping) return;

    setShowWelcome(false);
    setInput('');

    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('Failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      setIsTyping(false);
      const newMessageIndex = messages.length + 1;
      setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);
      setStreamingMessageId(newMessageIndex);

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
                  fullContent += data.choices[0].delta.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: fullContent,
                      isStreaming: true
                    };
                    return newMessages;
                  });
                }
              } catch {}
            }
          }
        }
      }

      // Mark streaming complete
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: fullContent || "How can I help?",
          isStreaming: false
        };
        return newMessages;
      });
      setStreamingMessageId(null);

    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Connection issue. Email michael@crowelogic.com",
        isStreaming: false
      }]);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-6 left-6 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10">
              <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-white/90">
                michael<span className="text-cyan-400">crowe</span>.ai
              </h1>
              <p className="text-xs text-white/40">AI Consultant</p>
            </div>
          </motion.div>

          {/* Chat container */}
          <div className="w-full max-w-2xl h-full max-h-[85vh] flex flex-col">
            {/* Welcome */}
            <AnimatePresence>
              {showWelcome && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: 0.8 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  {/* Avatar large */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                    className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)] mb-8"
                  >
                    <img src="/crowe-avatar.png" alt="Crowe AI" className="w-full h-full object-cover" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-4xl md:text-5xl font-light text-white/90 mb-3"
                  >
                    What can I build for you?
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="text-white/40 mb-10 max-w-md"
                  >
                    AI consulting, drug discovery, ML datasets, scheduling — through conversation.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-wrap gap-2 justify-center"
                  >
                    {quickActions.map((action, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage(action.prompt)}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm transition-all hover:text-white hover:border-white/20"
                      >
                        {action.label}
                      </motion.button>
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
                className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar isAI={msg.role === 'assistant'} />
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/20'
                          : 'bg-white/[0.03] border border-white/[0.06]'
                      }`}
                    >
                      {msg.role === 'assistant' && msg.isStreaming ? (
                        <StreamingText text={msg.content} />
                      ) : (
                        <p className="text-white/85 leading-relaxed whitespace-pre-wrap text-[15px]">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar isAI={true} />
                    <div className="bg-white/[0.03] border border-white/[0.06] px-4 py-3 rounded-2xl">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15
                            }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                          />
                        ))}
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
              transition={{ delay: 1.6 }}
              className="mt-auto pt-4"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent px-5 py-4 text-white placeholder-white/25 focus:outline-none text-[15px]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    disabled={isTyping || !input.trim()}
                    className="m-2 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <p className="text-center text-white/15 text-xs mt-3">
                Powered by GPT-4o on Azure
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-6 flex gap-6 text-white/20 text-xs"
          >
            <a href="mailto:michael@crowelogic.com" className="hover:text-white/50 transition-colors">Contact</a>
            <a href="https://github.com/MichaelCrowe11" className="hover:text-white/50 transition-colors">GitHub</a>
            <span className="text-white/10">© Crowe Logic, Inc.</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
