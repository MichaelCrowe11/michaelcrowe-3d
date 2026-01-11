import { create } from 'zustand';
import type { Agent } from '@/config/agents';

interface SessionState {
  selectedAgent: Agent | null;
  isInConversation: boolean;
  elapsedSeconds: number;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';

  selectAgent: (agent: Agent) => void;
  clearAgent: () => void;
  startConversation: () => void;
  endConversation: () => void;
  setConnectionStatus: (status: SessionState['connectionStatus']) => void;
  tick: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  selectedAgent: null,
  isInConversation: false,
  elapsedSeconds: 0,
  connectionStatus: 'disconnected',

  selectAgent: (agent) => set({ selectedAgent: agent }),
  clearAgent: () => set({ selectedAgent: null }),
  startConversation: () => set({ isInConversation: true, elapsedSeconds: 0, connectionStatus: 'connected' }),
  endConversation: () => set({ isInConversation: false, connectionStatus: 'disconnected' }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  tick: () => set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),
  reset: () => set({
    selectedAgent: null,
    isInConversation: false,
    elapsedSeconds: 0,
    connectionStatus: 'disconnected',
  }),
}));
