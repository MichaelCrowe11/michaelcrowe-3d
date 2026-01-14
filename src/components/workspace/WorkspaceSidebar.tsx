'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Search,
  Mic,
  Home,
} from 'lucide-react';
import Link from 'next/link';

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function WorkspaceSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isCollapsed,
  onToggleCollapse,
}: WorkspaceSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = groupByDate(filteredConversations);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="workspace-sidebar h-full flex flex-col relative"
    >
      {/* Header */}
      <div className="p-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
                  <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  Crowe <span className="text-[#d4a15f]">Logic</span>
                </span>
              </Link>
            </motion.div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/80 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-[#d4a15f]/30 hover:bg-[#d4a15f]/5 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Plus size={18} className="text-[#d4a15f]" />
          {!isCollapsed && (
            <span className="text-sm text-white/80">New conversation</span>
          )}
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-[#d4a15f]/30"
            />
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        {!isCollapsed && (
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedConversations).map(([group, convs]) => (
              <div key={group} className="mb-4">
                <p className="px-2 py-1 text-xs text-white/30 uppercase tracking-wider">
                  {group}
                </p>
                {convs.map((conv) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => onSelectConversation(conv.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group ${
                      activeConversationId === conv.id
                        ? 'bg-[#d4a15f]/10 border-l-2 border-[#d4a15f]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <MessageSquare
                      size={16}
                      className={
                        activeConversationId === conv.id
                          ? 'text-[#d4a15f]'
                          : 'text-white/40'
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{conv.title}</p>
                      <p className="text-xs text-white/30 truncate">{conv.preview}</p>
                    </div>
                    {hoveredId === conv.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.button>
                ))}
              </div>
            ))}
          </AnimatePresence>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center gap-2 py-2">
            {conversations.slice(0, 5).map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-2 rounded-lg transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-[#d4a15f]/10 text-[#d4a15f]'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                }`}
                title={conv.title}
              >
                <MessageSquare size={18} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/5">
        <div className={`flex ${isCollapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'}`}>
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
            title="Home"
          >
            <Home size={18} />
          </Link>
          <button
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
            title="Voice Mode"
          >
            <Mic size={18} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

function groupByDate(conversations: Conversation[]): Record<string, Conversation[]> {
  const groups: Record<string, Conversation[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  conversations.forEach((conv) => {
    const date = new Date(conv.updatedAt);
    let group: string;

    if (date >= today) {
      group = 'Today';
    } else if (date >= yesterday) {
      group = 'Yesterday';
    } else if (date >= lastWeek) {
      group = 'Last 7 days';
    } else {
      group = 'Older';
    }

    if (!groups[group]) groups[group] = [];
    groups[group].push(conv);
  });

  return groups;
}
