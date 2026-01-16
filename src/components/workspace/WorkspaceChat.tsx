'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Square,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Model {
  id: string;
  name: string;
  size?: string;
  family?: string;
  parameters?: string;
}

interface WorkspaceChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  selectedModel: Model | null;
  availableModels: Model[];
  onSelectModel: (model: Model) => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
  isVoiceActive: boolean;
  isListening: boolean;
  transcript: string;
  className?: string;
}

export function WorkspaceChat({
  messages,
  onSendMessage,
  isLoading,
  selectedModel,
  availableModels,
  onSelectModel,
  onStartVoice,
  onStopVoice,
  isVoiceActive,
  isListening,
  transcript,
  className,
}: WorkspaceChatProps) {
  const [input, setInput] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Update input with voice transcript
  useEffect(() => {
    if (transcript && isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={clsx('flex-1 flex flex-col h-full bg-[#050506]', className)}>
      {/* Model Selector Header */}
      <div className="border-b border-white/5 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <Sparkles size={16} className="text-[#d4a15f]" />
              <span className="text-sm text-white/80">
                {selectedModel?.name || 'Select Model'}
              </span>
              <ChevronDown
                size={16}
                className={`text-white/40 transition-transform ${
                  showModelSelector ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showModelSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-72 model-selector p-2 z-50 shadow-2xl"
                >
                  {availableModels.length > 0 ? (
                    availableModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onSelectModel(model);
                          setShowModelSelector(false);
                        }}
                        className={`w-full model-option px-3 py-2 rounded-lg text-left ${
                          selectedModel?.id === model.id ? 'active' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/80">{model.name}</span>
                          {model.parameters && (
                            <span className="text-xs text-white/40">{model.parameters}</span>
                          )}
                        </div>
                        {model.size && (
                          <p className="text-xs text-white/30 mt-0.5">{model.size}</p>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center">
                      <p className="text-sm text-white/40">No models found</p>
                      <p className="text-xs text-white/30 mt-1">
                        Make sure Ollama is running
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#d4a15f]/20 to-[#9a7b4a]/20 flex items-center justify-center">
                  <Zap size={32} className="text-[#d4a15f]" />
                </div>
                <h2 className="text-2xl font-light text-white mb-2">
                  How can I help you today?
                </h2>
                <p className="text-white/40 max-w-md">
                  Start a conversation with your local AI models. Voice-first, private, and powerful.
                </p>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 justify-center mt-8">
                  {[
                    'Explain quantum computing',
                    'Write a Python function',
                    'Help me brainstorm',
                    'Analyze this data',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`workspace-message p-4 ${
                    message.role === 'user' ? 'workspace-message-user ml-12' : 'mr-12'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a15f]/30 to-[#9a7b4a]/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={16} className="text-[#d4a15f]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-white/30">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
                          >
                            {copiedId === message.id ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-[#d4a15f]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-[#d4a15f]">You</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="workspace-message p-4 mr-12"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a15f]/30 to-[#9a7b4a]/30 flex items-center justify-center">
                      <Loader2 size={16} className="text-[#d4a15f] animate-spin" />
                    </div>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/5 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="workspace-input rounded-2xl overflow-hidden">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? 'Listening...' : 'Message your AI...'}
                rows={1}
                className="w-full px-4 py-4 pr-24 bg-transparent text-white/90 placeholder:text-white/30 resize-none focus:outline-none"
                style={{ minHeight: '56px', maxHeight: '200px' }}
              />

              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {/* Voice Button */}
                <button
                  type="button"
                  onClick={isVoiceActive ? onStopVoice : onStartVoice}
                  className={`p-2 rounded-lg transition-all ${
                    isVoiceActive
                      ? 'bg-red-500/20 text-red-400 voice-active'
                      : 'hover:bg-white/10 text-white/40 hover:text-white/60'
                  }`}
                  title={isVoiceActive ? 'Stop voice' : 'Start voice'}
                >
                  {isVoiceActive ? (
                    isListening ? (
                      <Mic size={20} className="animate-pulse" />
                    ) : (
                      <Square size={20} />
                    )
                  ) : (
                    <MicOff size={20} />
                  )}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-lg transition-all ${
                    input.trim() && !isLoading
                      ? 'bg-[#d4a15f] text-black hover:bg-[#e2b577]'
                      : 'bg-white/5 text-white/20'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>

            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-12 left-0 right-0 flex items-center justify-center"
              >
                <div className="px-4 py-2 rounded-full bg-[#d4a15f]/10 border border-[#d4a15f]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm text-white/60">Listening...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-xs text-white/20 mt-3">
            Powered by your local Ollama models. Your conversations stay private.
          </p>
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
