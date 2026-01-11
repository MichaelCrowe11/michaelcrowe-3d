'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function VoiceChat({ visible }: { visible: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showMessages, setShowMessages] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        setTranscript(text);

        if (result.isFinal) {
          handleUserMessage(text);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing && !isSpeaking) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setShowMessages(true);
    setIsProcessing(true);
    setTranscript('');

    try {
      // Get AI response from Azure GPT-4o
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
                }
              } catch {}
            }
          }
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: fullContent || "I'm here to help."
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);

      // Speak the response with ElevenLabs
      await speakWithElevenLabs(assistantMessage.content);

    } catch {
      setIsProcessing(false);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Connection issue. Try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const speakWithElevenLabs = async (text: string) => {
    setIsSpeaking(true);
    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => setIsSpeaking(false);
          await audioRef.current.play();
        }
      } else {
        setIsSpeaking(false);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  const orbState = isListening ? 'listening' : isSpeaking ? 'speaking' : isProcessing ? 'thinking' : 'idle';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1.5, type: 'spring', damping: 15 }}
          className="fixed inset-0 z-30 flex items-center justify-center"
        >
          {/* Hidden audio element */}
          <audio ref={audioRef} className="hidden" />

          {/* Outer glow rings */}
          <motion.div
            animate={{
              scale: orbState === 'listening' ? [1, 1.2, 1] : orbState === 'speaking' ? [1, 1.15, 1] : 1,
              opacity: orbState === 'idle' ? 0.5 : 0.8
            }}
            transition={{ duration: 1.5, repeat: orbState !== 'idle' ? Infinity : 0 }}
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: orbState === 'listening' ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 1, repeat: orbState === 'listening' ? Infinity : 0 }}
            className="absolute w-[280px] h-[280px] rounded-full bg-gradient-to-r from-violet-500/15 to-cyan-500/15 blur-2xl"
          />

          {/* Main orb button */}
          <motion.button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            animate={{
              scale: orbState === 'listening' ? [1, 1.05, 1] : 1,
              boxShadow: orbState === 'listening'
                ? ['0 0 60px rgba(239, 68, 68, 0.5)', '0 0 100px rgba(239, 68, 68, 0.8)', '0 0 60px rgba(239, 68, 68, 0.5)']
                : orbState === 'speaking'
                ? ['0 0 60px rgba(34, 211, 238, 0.5)', '0 0 100px rgba(34, 211, 238, 0.8)', '0 0 60px rgba(34, 211, 238, 0.5)']
                : '0 0 60px rgba(34, 211, 238, 0.3)'
            }}
            transition={{ duration: 0.8, repeat: orbState !== 'idle' && orbState !== 'thinking' ? Infinity : 0 }}
            className={`relative w-[160px] h-[160px] rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 ${
              isProcessing || isSpeaking ? 'cursor-not-allowed' : 'hover:scale-105'
            } ${
              orbState === 'listening'
                ? 'bg-gradient-to-br from-red-500/30 to-orange-500/20'
                : orbState === 'speaking'
                ? 'bg-gradient-to-br from-cyan-500/30 to-emerald-500/20'
                : 'bg-gradient-to-br from-white/[0.08] to-white/[0.02]'
            }`}
          >
            {/* Inner highlight */}
            <div className="absolute top-4 left-6 w-10 h-6 bg-white/20 rounded-full blur-md" />

            {/* Center icon */}
            <motion.div
              animate={{
                scale: orbState === 'thinking' ? [1, 0.9, 1] : 1,
                rotate: orbState === 'thinking' ? 360 : 0
              }}
              transition={{
                duration: orbState === 'thinking' ? 1 : 0.3,
                repeat: orbState === 'thinking' ? Infinity : 0,
                ease: 'linear'
              }}
              className="relative z-10"
            >
              {orbState === 'listening' ? (
                <svg className="w-12 h-12 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              ) : orbState === 'speaking' ? (
                <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              ) : orbState === 'thinking' ? (
                <div className="w-10 h-10 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full" />
              ) : (
                <svg className="w-12 h-12 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              )}
            </motion.div>
          </motion.button>

          {/* Transcript display */}
          <AnimatePresence>
            {(transcript || isListening) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[calc(50%+120px)] text-center max-w-md px-4"
              >
                <p className="text-white/70 text-lg">
                  {transcript || (isListening ? 'Listening...' : '')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages panel */}
          <AnimatePresence>
            {showMessages && messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full max-w-lg max-h-48 overflow-y-auto px-4"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 space-y-3">
                  {messages.slice(-4).map((msg, i) => (
                    <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-cyan-300' : 'text-white/80'}`}>
                      <span className="text-white/40 text-xs">{msg.role === 'user' ? 'You: ' : 'AI: '}</span>
                      {msg.content}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full ${
                orbState === 'listening' ? 'bg-red-400/60' : 'bg-cyan-400/60'
              }`}
              animate={{
                x: [0, Math.cos(i * 30 * Math.PI / 180) * (100 + i * 10), 0],
                y: [0, Math.sin(i * 30 * Math.PI / 180) * (100 + i * 10), 0],
                opacity: [0.2, 0.7, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Status text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-20 text-white/30 text-xs"
          >
            {orbState === 'idle' ? 'Tap to speak' :
             orbState === 'listening' ? 'Listening...' :
             orbState === 'thinking' ? 'Thinking...' :
             orbState === 'speaking' ? 'Speaking...' : ''}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
