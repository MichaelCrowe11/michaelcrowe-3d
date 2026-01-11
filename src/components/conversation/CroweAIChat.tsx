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
            className={`fixed bottom-6 right-6 z-50 flex gap-4 ${
              isExpanded ? 'w-[900px]' : 'w-[420px]'
            } transition-all duration-300`}
          >
            {/* Checkout Browser Panel */}
            <AnimatePresence>
              {showCheckout && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="w-[450px] h-[600px] rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(3,3,3,0.98)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Browser toolbar */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/60 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <button onClick={() => { setShowCheckout(false); setIsExpanded(false); }} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
                      <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400" />
                      <button onClick={() => window.open(checkoutUrl, '_blank')} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400" />
                    </div>
                    <div className="flex-1 mx-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                      <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-white/60">Secure Checkout</span>
                    </div>
                  </div>
                  <iframe src={checkoutUrl} className="w-full h-[calc(100%-48px)] border-0 bg-white" title="Checkout" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Chat Panel */}
            <motion.div
              className="w-[420px] h-[600px] rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: 'linear-gradient(180deg, rgba(3,3,3,0.98), rgba(10,10,10,0.95))',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: agentStatus === 'speaking'
                  ? `0 0 ${40 + audioLevel * 40}px rgba(6, 182, 212, ${0.3 + audioLevel * 0.3}), 0 20px 60px rgba(0,0,0,0.5)`
                  : '0 20px 60px rgba(0,0,0,0.5)',
              }}
              layout
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 p-1">
                    <img src="/crowe-avatar.png" alt="Crowe Logic" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">Crowe Logic</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${statusConfig[agentStatus].color} ${agentStatus !== 'idle' ? 'animate-pulse' : ''}`} />
                      <span className="text-white/50 text-xs">{statusConfig[agentStatus].label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTextMode(!isTextMode)}
                    className={`p-2 rounded-lg transition-colors ${isTextMode ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/50 hover:bg-white/10'}`}
                    title="Toggle text mode"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); endConversation(); }}
                    className="p-2 rounded-lg text-white/50 hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                        : 'bg-white/10 text-white/90'
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
                      className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-semibold">{activeProduct.name}</h4>
                          <p className="text-white/50 text-xs">{activeProduct.description}</p>
                        </div>
                        <span className="text-cyan-400 font-bold">{activeProduct.price}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openCheckout(activeProduct.checkoutUrl)}
                          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:opacity-90"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => setActiveProduct(null)}
                          className="px-3 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20"
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
                <div className="px-4 py-2 flex justify-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 rounded-full ${agentStatus === 'speaking' ? 'bg-cyan-400' : 'bg-emerald-400'}`}
                      animate={{
                        height: `${8 + audioLevel * 32 * Math.abs(Math.sin(Date.now() / 100 + i * 0.4))}px`,
                      }}
                      transition={{ duration: 0.05 }}
                    />
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-white/10">
                {isTextMode ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      onClick={sendTextMessage}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => connectionStatus === 'connected' ? endConversation() : startConversation()}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        connectionStatus === 'connected'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90'
                      }`}
                      style={{
                        boxShadow: connectionStatus === 'connected'
                          ? '0 0 30px rgba(239, 68, 68, 0.4)'
                          : '0 0 30px rgba(6, 182, 212, 0.4)',
                      }}
                    >
                      {connectionStatus === 'connecting' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : connectionStatus === 'connected' ? (
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h12v12H6z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
                <p className="text-center text-white/30 text-xs mt-2">
                  {connectionStatus === 'connected' ? 'Tap to end • Switch to text mode above' : 'Tap to start voice conversation'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
