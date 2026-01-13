'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import for Three.js orb to avoid SSR issues
const LiquidOrbButton = dynamic(
  () => import('./LiquidOrbButton').then((mod) => mod.LiquidOrbButton),
  { ssr: false, loading: () => <div className="w-20 h-20" /> }
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  checkoutUrl: string;
}

const PRODUCTS: Record<string, Product> = {
  digital: {
    id: 'prod_TluqIRTGNTLkXC',
    name: 'Digital Masterclass',
    price: '$499',
    description: 'Complete digital cultivation guide with AI access',
    checkoutUrl: 'https://buy.stripe.com/8wM4jC7Gv5G56RycMO'
  },
  hardcover: {
    id: 'prod_TVswtN5lJzcvjo',
    name: 'Premium Hardcover',
    price: '$899',
    description: '1,400-page encyclopedia + digital access',
    checkoutUrl: 'https://buy.stripe.com/00g2bueaT1pPcbu4gk'
  },
  consultation: {
    id: 'prod_TluqOymLTmLRHM',
    name: 'Expert Consultation',
    price: '$250/hr',
    description: 'One-on-one session with Michael Crowe',
    checkoutUrl: 'https://buy.stripe.com/6oE2bu1i73xXcbu6ou'
  },
  subscription: {
    id: 'prod_Tlt4EQ1eEP9KTd',
    name: 'AI Premium Access',
    price: '$99/mo',
    description: 'Unlimited AI assistant access',
    checkoutUrl: 'https://buy.stripe.com/7sI9E0f2R3xX9Zi5kp'
  }
};

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export function CroweAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const AGENT_ID = 'bBKor4JZfhlkTrCfFRa8';

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect products in messages
  const detectProducts = useCallback((text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('digital') || lower.includes('masterclass')) {
      setActiveProduct(PRODUCTS.digital);
    } else if (lower.includes('hardcover') || lower.includes('premium edition') || lower.includes('899')) {
      setActiveProduct(PRODUCTS.hardcover);
    } else if (lower.includes('consult') || lower.includes('session')) {
      setActiveProduct(PRODUCTS.consultation);
    } else if (lower.includes('subscription') || lower.includes('ai access') || lower.includes('99/mo')) {
      setActiveProduct(PRODUCTS.subscription);
    }
  }, []);

  // Start conversation
  const startConversation = async () => {
    try {
      setConnectionStatus('connecting');

      // Dynamic import to avoid SSR issues
      const { Conversation } = await import('@elevenlabs/client');

      const conversation = await Conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'websocket' as const,
        onConnect: () => {
          setConnectionStatus('connected');
          setAgentStatus('listening');
          addMessage('assistant', "Hi! I'm Michael's AI assistant. How can I help you today?");
        },
        onDisconnect: () => {
          setConnectionStatus('disconnected');
          setAgentStatus('idle');
        },
        onMessage: (message: { message: string; source: string }) => {
          if (message.source === 'user') {
            addMessage('user', message.message);
          } else if (message.source === 'ai') {
            addMessage('assistant', message.message);
            detectProducts(message.message);
          }
        },
        onModeChange: (mode: { mode: string }) => {
          if (mode.mode === 'speaking') {
            setAgentStatus('speaking');
          } else if (mode.mode === 'listening') {
            setAgentStatus('listening');
          }
        },
        onError: (message: string, context?: any) => {
          console.error('Conversation error:', message, context);
          setConnectionStatus('error');
        },
      });

      conversationRef.current = conversation;

      // Set up audio analysis for visualization
      setupAudioVisualization();

    } catch (error) {
      console.error('Failed to start conversation:', error);
      setConnectionStatus('error');
    }
  };

  // End conversation
  const endConversation = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setConnectionStatus('disconnected');
    setAgentStatus('idle');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Add message to chat
  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }]);
  };

  // Send text message
  const sendTextMessage = async () => {
    if (!inputText.trim() || !conversationRef.current) return;

    const text = inputText.trim();
    setInputText('');
    addMessage('user', text);

    // The SDK handles sending to the agent
    // For text mode, we'd need to use a different approach
  };

  // Setup audio visualization
  const setupAudioVisualization = () => {
    // Simulated audio levels for now
    const animate = () => {
      if (agentStatus === 'speaking') {
        const time = Date.now() / 1000;
        const level = 0.4 + Math.sin(time * 10) * 0.25 + Math.random() * 0.2;
        setAudioLevel(Math.min(1, Math.max(0, level)));
      } else if (agentStatus === 'listening') {
        setAudioLevel(0.2 + Math.random() * 0.3);
      } else {
        setAudioLevel(0);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  // Open checkout
  const openCheckout = (url: string) => {
    setCheckoutUrl(url);
    setShowCheckout(true);
    setIsExpanded(true);
  };

  // Status colors
  const statusConfig = {
    idle: { color: 'bg-gray-500', label: 'Ready' },
    listening: { color: 'bg-emerald-500', label: 'Listening...' },
    thinking: { color: 'bg-yellow-500', label: 'Thinking...' },
    speaking: { color: 'bg-cyan-500', label: 'Speaking' },
  };


  return (
    <>
      {/* 3D Liquid Orb Button - Bottom Right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <LiquidOrbButton
              onClick={() => {
                setIsOpen(true);
                if (connectionStatus === 'disconnected') {
                  startConversation();
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed z-50 flex gap-4 transition-all duration-300 
              inset-0 items-center justify-center p-4 bg-black/60 backdrop-blur-sm flex-col md:flex-row
              md:bg-transparent md:backdrop-blur-none md:inset-auto md:items-end md:justify-end md:bottom-6 md:right-6 md:p-0
              ${isExpanded ? 'md:w-[900px]' : 'w-full md:w-[420px]'}
            `}
          >
            {/* Checkout Browser Panel */}
            <AnimatePresence>
              {showCheckout && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="w-full max-w-[420px] h-[40vh] md:h-[600px] md:w-[450px] rounded-2xl overflow-hidden backdrop-blur-3xl order-2 md:order-1"
                  style={{
                    background: 'rgba(3,3,3,0.9)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Browser toolbar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                      <button onClick={() => { setShowCheckout(false); setIsExpanded(false); }} className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                      <button className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                      <button onClick={() => window.open(checkoutUrl, '_blank')} className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                    </div>
                    <div className="flex-1 mx-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 shadow-inner">
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-white/50 font-medium">Secure Checkout</span>
                    </div>
                  </div>
                  <iframe src={checkoutUrl} className="w-full h-[calc(100%-48px)] border-0 bg-white" title="Checkout" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Chat Panel */}
            <motion.div
              className="w-full max-w-[420px] h-[85vh] md:h-[600px] rounded-2xl overflow-hidden flex flex-col backdrop-blur-3xl"
              style={{
                background: 'rgba(3, 3, 3, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: agentStatus === 'speaking'
                  ? `0 0 ${40 + audioLevel * 40}px rgba(6, 182, 212, ${0.15 + audioLevel * 0.15}), 0 20px 60px rgba(0,0,0,0.6)`
                  : '0 20px 60px rgba(0,0,0,0.6)',
              }}
              layout
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 p-[1px] ring-1 ring-white/10">
                    <img src="/crowe-avatar.png" alt="Crowe Logic" className="w-full h-full object-contain rounded-[10px]" />
                  </div>
                  <div>
                    <h3 className="text-white font-display font-semibold text-sm tracking-wide">Crowe Logic</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[agentStatus].color} ${agentStatus !== 'idle' ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor]`} />
                      <span className="text-white/40 text-[10px] items-center font-medium uppercase tracking-wider">{statusConfig[agentStatus].label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsTextMode(!isTextMode)}
                    className={`p-2 rounded-lg transition-all duration-300 ${isTextMode ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/30 hover:bg-white/5 hover:text-white/70'}`}
                    title="Toggle text mode"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); endConversation(); }}
                    className="p-2 rounded-lg text-white/30 hover:bg-white/5 hover:text-white/70 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-lg backdrop-blur-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-cyan-600/90 to-emerald-600/90 text-white rounded-br-none border border-white/10'
                        : 'bg-white/5 text-gray-200 rounded-bl-none border border-white/5'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />

                {/* Product Card */}
                <AnimatePresence>
                  {activeProduct && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-display font-semibold text-lg">{activeProduct.name}</h4>
                          <p className="text-white/50 text-xs font-light tracking-wide">{activeProduct.description}</p>
                        </div>
                        <span className="text-cyan-400 font-bold font-display text-lg drop-shadow-sm">{activeProduct.price}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => openCheckout(activeProduct.checkoutUrl)}
                          className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-bold tracking-wide shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95"
                        >
                          Continue
                        </button>
                        <button
                          onClick={() => setActiveProduct(null)}
                          className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm hover:text-white transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Audio Visualizer */}
              {(agentStatus === 'speaking' || agentStatus === 'listening') && (
                <div className="px-5 py-4 flex justify-center gap-1.5 border-t border-white/5 bg-black/20">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 rounded-full ${agentStatus === 'speaking' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`}
                      animate={{
                        height: `${6 + audioLevel * 24 * Math.abs(Math.sin(Date.now() / 100 + i * 0.4))}px`,
                      }}
                      transition={{ duration: 0.05 }}
                    />
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                {isTextMode ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/30 focus:bg-black/40 transition-all font-light"
                    />
                    <button
                      onClick={sendTextMessage}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:opacity-90 shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-2">
                    <button
                      onClick={() => connectionStatus === 'connected' ? endConversation() : startConversation()}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                        connectionStatus === 'connected'
                          ? 'bg-red-500/80 hover:bg-red-600'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 group'
                      }`}
                      style={{
                        boxShadow: connectionStatus === 'connected'
                          ? '0 0 30px rgba(239, 68, 68, 0.3)'
                          : '0 0 0 rgba(0,0,0,0)',
                      }}
                    >
                      {connectionStatus === 'connecting' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : connectionStatus === 'connected' ? (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h12v12H6z" />
                        </svg>
                      ) : (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                          <svg className="w-8 h-8 text-white relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                )}
                <p className="text-center text-white/30 text-[10px] mt-3 font-medium uppercase tracking-widest">
                  {connectionStatus === 'connected' ? 'Tap to end • Switch to text mode above' : 'Tap for Voice Mode'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
