'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm the AI assistant for Michael Crowe. I can help you learn about AI consulting services, drug discovery AI, datasets, or the Mushroom Cultivator's Masterclass. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

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
          newMessages[newMessages.length - 1].content = "I'm here to help with AI consulting, products, and services. How can I assist you?";
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Please email michael@crowelogic.com for immediate assistance."
      }]);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src="/crowe-avatar.png"
          alt="Crowe AI"
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white text-xl font-bold">MC</span>';
          }}
        />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center overflow-hidden">
                <img
                  src="/crowe-avatar.png"
                  alt="Crowe AI"
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">Crowe AI Assistant</h4>
                <span className="text-xs text-cyan-400">Claude 4.5 Opus</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-cyan-500 to-emerald-500'
                  }`}>
                    {msg.role === 'user' ? 'MC' : (
                      <img
                        src="/crowe-avatar.png"
                        alt="AI"
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <p className="text-sm text-gray-200 leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                    <img src="/crowe-avatar.png" alt="AI" className="w-6 h-6 rounded-full object-cover" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about AI consulting..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={isTyping}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Powered by Vercel AI Gateway</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
