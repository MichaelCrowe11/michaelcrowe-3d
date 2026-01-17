'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { WorkspaceSidebar, Conversation } from '@/components/workspace/WorkspaceSidebar';
import { WorkspaceChat, Message } from '@/components/workspace/WorkspaceChat';
import { WorkspaceModes } from '@/components/workspace/WorkspaceModes';
import { RunbooksPanel } from '@/components/workspace/RunbooksPanel';
import { CurationPanel } from '@/components/workspace/CurationPanel';
import { VoiceConsolePanel } from '@/components/workspace/VoiceConsolePanel';
import { workspaceModes, type WorkspaceMode } from '@/data/workspaceAgents';

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
  const [activeMode, setActiveMode] = useState<WorkspaceMode>('runbooks');
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
  const activeModeMeta = workspaceModes.find((mode) => mode.id === activeMode);

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

  useEffect(() => {
    const handleToggle = () => {
      setIsMobileSidebarOpen((prev) => !prev);
    };
    window.addEventListener('workspace:toggle-sidebar', handleToggle as EventListener);
    return () => window.removeEventListener('workspace:toggle-sidebar', handleToggle as EventListener);
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
    <div className="min-h-screen flex bg-[#050506] overflow-hidden">
      {/* Optional 3D Background - hidden on mobile for performance */}
      {showBackground && (
        <div className="fixed inset-0 z-0 opacity-30 hidden lg:block pointer-events-none">
          <IntroScene onIntroComplete={() => {}} />
        </div>
      )}

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
          activeMode={activeMode}
          onSelectMode={setActiveMode}
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
            className="fixed top-0 left-0 bottom-0 w-[280px] z-50 md:hidden"
          >
            <WorkspaceSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              activeMode={activeMode}
              onSelectMode={(mode) => {
                setActiveMode(mode);
                setIsMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Area */}
      <main className="flex-1 relative z-10 pt-0">
        <div className="h-full overflow-y-auto">
          <div className="px-6 pt-6 pb-4 md:px-10 border-b border-white/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Crowe Logic Research Studio</p>
                <h1 className="text-2xl md:text-3xl font-semibold text-white mt-2">{activeModeMeta?.label || 'Workspace'}</h1>
                <p className="text-sm text-white/50 mt-2 max-w-2xl">{activeModeMeta?.summary}</p>
              </div>
              <WorkspaceModes activeMode={activeMode} onSelectMode={setActiveMode} />
            </div>
          </div>
          <div className="px-6 py-6 md:px-10 pb-16">
            {activeMode === 'runbooks' && (
              <RunbooksPanel
                mode={activeMode}
                chat={
                  <WorkspaceChat
                    className="h-full"
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
                }
              />
            )}
            {activeMode === 'curation' && <CurationPanel mode={activeMode} />}
            {activeMode === 'voice' && <VoiceConsolePanel mode={activeMode} />}
          </div>
        </div>
      </main>
    </div>
  );
}
