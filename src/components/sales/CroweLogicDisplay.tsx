'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: string;
  checkoutUrl: string;
}

const PRODUCTS: Record<string, Product> = {
  'prod_TluqIRTGNTLkXC': {
    id: 'prod_TluqIRTGNTLkXC',
    name: 'Digital Masterclass',
    price: '$499',
    checkoutUrl: 'https://buy.stripe.com/8wM4jC7Gv5G56RycMO'
  },
  'prod_TVswtN5lJzcvjo': {
    id: 'prod_TVswtN5lJzcvjo',
    name: 'Premium Hardcover',
    price: '$899',
    checkoutUrl: 'https://buy.stripe.com/00g2bueaT1pPcbu4gk'
  },
  'prod_TluqOymLTmLRHM': {
    id: 'prod_TluqOymLTmLRHM',
    name: 'Consultation',
    price: '$250/hr',
    checkoutUrl: 'https://buy.stripe.com/6oE2bu1i73xXcbu6ou'
  },
  'prod_Tlt4EQ1eEP9KTd': {
    id: 'prod_Tlt4EQ1eEP9KTd',
    name: 'AI Premium Access',
    price: '$99/mo',
    checkoutUrl: 'https://buy.stripe.com/7sI9E0f2R3xX9Zi5kp'
  }
};

type DisplayMode = 'logo' | 'browser' | 'speaking';

export function CroweLogicDisplay() {
  const [mode, setMode] = useState<DisplayMode>('logo');
  const [browserUrl, setBrowserUrl] = useState<string>('');
  const [browserTitle, setBrowserTitle] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for events
  useEffect(() => {
    const handleAgentResponse = (event: CustomEvent) => {
      setIsSpeaking(true);
      const message = event.detail?.message?.toLowerCase() || '';

      // Detect product mentions and open browser
      if (message.includes('digital') || message.includes('masterclass')) {
        openBrowser(PRODUCTS['prod_TluqIRTGNTLkXC']);
      } else if (message.includes('hardcover') || message.includes('premium edition') || message.includes('$899')) {
        openBrowser(PRODUCTS['prod_TVswtN5lJzcvjo']);
      } else if (message.includes('consult') || message.includes('session')) {
        openBrowser(PRODUCTS['prod_TluqOymLTmLRHM']);
      } else if (message.includes('ai access') || message.includes('subscription')) {
        openBrowser(PRODUCTS['prod_Tlt4EQ1eEP9KTd']);
      } else if (message.includes('checkout') || message.includes('payment link')) {
        // Keep browser open if already showing
      } else if (mode !== 'browser') {
        setMode('speaking');
      }
    };

    const handleConversationEnded = () => {
      setIsSpeaking(false);
      if (mode === 'speaking') {
        setMode('logo');
      }
    };

    const handleClientTool = (event: CustomEvent) => {
      const { tool_name, parameters } = event.detail || {};

      if (tool_name === 'open_checkout' && parameters?.url) {
        setBrowserUrl(parameters.url);
        setBrowserTitle('Checkout');
        setMode('browser');
        setIsExpanded(true);
      }
    };

    window.addEventListener('elevenlabs-convai:agent-response', handleAgentResponse as EventListener);
    window.addEventListener('elevenlabs-convai:conversation-ended', handleConversationEnded as EventListener);
    window.addEventListener('elevenlabs-convai:client-tool', handleClientTool as EventListener);

    return () => {
      window.removeEventListener('elevenlabs-convai:agent-response', handleAgentResponse as EventListener);
      window.removeEventListener('elevenlabs-convai:conversation-ended', handleConversationEnded as EventListener);
      window.removeEventListener('elevenlabs-convai:client-tool', handleClientTool as EventListener);
    };
  }, [mode]);

  // Animate audio level
  useEffect(() => {
    let animationId: number;
    if (isSpeaking && mode !== 'browser') {
      const animate = () => {
        const time = Date.now() / 1000;
        const level = 0.4 + Math.sin(time * 8) * 0.2 + Math.sin(time * 13) * 0.15 + Math.random() * 0.15;
        setAudioLevel(Math.min(1, Math.max(0, level)));
        animationId = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setAudioLevel(0);
    }
    return () => cancelAnimationFrame(animationId);
  }, [isSpeaking, mode]);

  const openBrowser = (product: Product) => {
    setBrowserUrl(product.checkoutUrl);
    setBrowserTitle(product.name);
    setMode('browser');
  };

  const closeBrowser = () => {
    setMode('logo');
    setBrowserUrl('');
    setBrowserTitle('');
    setIsExpanded(false);
  };

  // Size based on mode
  const containerSize = isExpanded
    ? 'w-[450px] h-[600px]'
    : mode === 'browser'
    ? 'w-80 h-96'
    : 'w-56 h-64';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
      className={`fixed bottom-6 left-6 z-50 ${containerSize} transition-all duration-300`}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(3,3,3,0.98), rgba(15,15,15,0.95))',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: isSpeaking && mode !== 'browser'
            ? `0 0 ${30 + audioLevel * 30}px rgba(212, 161, 95, ${0.28 + audioLevel * 0.3}), 0 15px 50px rgba(0,0,0,0.6)`
            : '0 15px 50px rgba(0,0,0,0.6)',
        }}
        layout
      >
        <AnimatePresence mode="wait">
          {/* Logo Mode */}
          {mode === 'logo' && (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <img
                src="/crowe-avatar.png"
                alt="Crowe Logic"
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}

          {/* Speaking Mode */}
          {mode === 'speaking' && (
            <motion.div
              key="speaking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6"
            >
              <img
                src="/crowe-avatar.png"
                alt="Crowe Logic"
                className="w-3/4 h-3/4 object-contain"
                style={{
                  filter: `brightness(${1 + audioLevel * 0.2})`,
                }}
              />
              {/* Audio visualizer */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-[#d4a15f] to-[#6fd6cc] rounded-full"
                    animate={{
                      height: `${4 + audioLevel * 24 * Math.abs(Math.sin(Date.now() / 80 + i * 0.5))}px`,
                    }}
                    transition={{ duration: 0.05 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Browser Mode */}
          {mode === 'browser' && (
            <motion.div
              key="browser"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Browser toolbar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-black/60 border-b border-white/10">
                {/* Traffic lights */}
                <div className="flex gap-1.5">
                  <button
                    onClick={closeBrowser}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                    title="Close"
                  />
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
                    title="Minimize"
                  />
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                    title="Expand"
                  />
                </div>

                {/* URL bar */}
                <div className="flex-1 mx-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10">
                    <svg className="w-3 h-3 text-[#6fd6cc]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-white/60 truncate">{browserTitle || 'Secure Checkout'}</span>
                  </div>
                </div>

                {/* Open in new tab */}
                <button
                  onClick={() => window.open(browserUrl, '_blank')}
                  className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  title="Open in new tab"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>

              {/* Browser content */}
              <div className="flex-1 bg-white relative">
                {browserUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={browserUrl}
                    className="w-full h-full border-0"
                    title="Checkout"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <p className="text-white/50">Loading...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speaking pulse rings */}
        {isSpeaking && mode !== 'browser' && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl border border-[#d4a15f]/30 pointer-events-none"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.08 + i * 0.04, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </>
        )}

        {/* Status badge - only in non-browser mode */}
        {mode !== 'browser' && (
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              isSpeaking
                ? 'bg-[#d4a15f]/20 text-[#d4a15f] border border-[#d4a15f]/30'
                : 'bg-white/10 text-white/50 border border-white/10'
            }`}>
              {isSpeaking ? 'Speaking' : 'Ready'}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
