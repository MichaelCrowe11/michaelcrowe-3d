'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { WorkspaceSidebar, Conversation } from '@/components/workspace/WorkspaceSidebar';
import { WorkspaceChat, Message } from '@/components/workspace/WorkspaceChat';
import { Menu, X } from 'lucide-react';

// Dynamic import for 3D background - optional enhancement
const IntroScene = dynamic(
  () => import('@/components/three/IntroScene').then((mod) => mod.IntroScene),
  { ssr: false }
);

interface Model {
  id: string;
  name: string;
  size?: string;
  family?: string;
  parameters?: string;
}

export default function WorkspacePage() {
  // State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showBackground, setShowBackground] = useState(true);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load models on mount
  useEffect(() => {
    fetchModels();
    loadConversations();

    // Check for mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch available models from Ollama
  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ollama/models');
      const data = await response.json();
      if (data.models && data.models.length > 0) {
        setModels(data.models);
        setSelectedModel(data.models[0]);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
      // Set default models if Ollama is not available
      const defaults = [
        { id: 'llama3.2', name: 'Llama 3.2', parameters: '3B' },
        { id: 'mistral', name: 'Mistral', parameters: '7B' },
      ];
      setModels(defaults);
      setSelectedModel(defaults[0]);
    }
  };

  // Load conversations from localStorage
  const loadConversations = () => {
    try {
      const saved = localStorage.getItem('crowe-conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConversations(parsed.map((c: Conversation) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        })));
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  // Save conversations to localStorage
  const saveConversations = useCallback((convs: Conversation[]) => {
    try {
      localStorage.setItem('crowe-conversations', JSON.stringify(convs));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }, []);

  // Create new conversation
  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      preview: 'Start typing...',
      model: selectedModel?.id || 'llama3.2',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setActiveConversationId(newConv.id);
    setMessages([]);
    setIsMobileSidebarOpen(false);
  };

  // Select conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // Load messages for this conversation
    const convMessages = localStorage.getItem(`crowe-messages-${id}`);
    if (convMessages) {
      setMessages(JSON.parse(convMessages).map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })));
    } else {
      setMessages([]);
    }
    setIsMobileSidebarOpen(false);
  };

  // Delete conversation
  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    saveConversations(updated);
    localStorage.removeItem(`crowe-messages-${id}`);

    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!selectedModel) return;

    // Create conversation if needed
    let convId = activeConversationId;
    if (!convId) {
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        preview: content.slice(0, 50),
        model: selectedModel.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = [newConv, ...conversations];
      setConversations(updated);
      saveConversations(updated);
      convId = newConv.id;
      setActiveConversationId(convId);
    }

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ollama/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Create assistant message placeholder
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              if (json.content) {
                fullContent += json.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }

        // Save messages
        const finalMessages = [...updatedMessages, { ...assistantMessage, content: fullContent }];
        localStorage.setItem(`crowe-messages-${convId}`, JSON.stringify(finalMessages));

        // Update conversation preview
        const updatedConvs = conversations.map((c) =>
          c.id === convId
            ? {
                ...c,
                preview: fullContent.slice(0, 50),
                updatedAt: new Date(),
              }
            : c
        );
        setConversations(updatedConvs);
        saveConversations(updatedConvs);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Chat error:', error);
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please make sure Ollama is running and try again.',
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Voice controls
  const handleStartVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsVoiceActive(true);
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsVoiceActive(false);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleStopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceActive(false);
    setIsListening(false);

    // If there's a transcript, send it
    if (transcript.trim()) {
      handleSendMessage(transcript.trim());
      setTranscript('');
    }
  };

  return (
    <div className="h-screen h-dvh flex bg-[#050506] overflow-hidden">
      {/* Optional 3D Background - hidden on mobile for performance */}
      {showBackground && (
        <div className="fixed inset-0 z-0 opacity-30 hidden lg:block pointer-events-none">
          <IntroScene onIntroComplete={() => {}} />
        </div>
      )}

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#050506]/95 backdrop-blur-lg border-b border-white/5 flex items-center px-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/60"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm font-medium text-white/80">
            Crowe <span className="text-[#d4a15f]">Logic</span> Console
          </span>
        </div>
        <div className="w-10" /> {/* Spacer for symmetry */}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <div className="hidden md:block relative z-10">
        <WorkspaceSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-14 left-0 bottom-0 w-[280px] z-50 md:hidden"
          >
            <WorkspaceSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 relative z-10 pt-14 md:pt-0">
        <WorkspaceChat
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          availableModels={models}
          onSelectModel={setSelectedModel}
          onStartVoice={handleStartVoice}
          onStopVoice={handleStopVoice}
          isVoiceActive={isVoiceActive}
          isListening={isListening}
          transcript={transcript}
        />
      </main>
    </div>
  );
}
