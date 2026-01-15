/**
 * Agent-specific interface configurations
 * Define custom themes, layouts, and features for each agent
 */

export interface AgentInterfaceTheme {
  primaryColor: string;
  secondaryColor: string;
  accentGradient: string;
  glowColor: string;
  orbGradient: string;
  pulseColor: string;
}

export interface AgentInterfaceConfig {
  id: string;
  theme: AgentInterfaceTheme;
  suggestedTopics: string[];
  welcomeMessage: string;
  orbStyle: 'standard' | 'animated' | 'pulsing' | 'morphing';
  backgroundStyle: 'default' | 'cultivation' | 'scientific' | 'corporate' | 'molecular';
  customFeatures?: {
    showVisualizer?: boolean;
    showTranscript?: boolean;
    enableRealTimeData?: boolean;
  };
}

export const agentInterfaceConfigs: Record<string, AgentInterfaceConfig> = {
  'cultivation': {
    id: 'cultivation',
    theme: {
      primaryColor: '#a855f7', // purple-500
      secondaryColor: '#10b981', // emerald-500
      accentGradient: 'from-purple-500 to-emerald-500',
      glowColor: 'rgba(168, 85, 247, 0.5)',
      orbGradient: 'from-purple-500/70 to-emerald-500/50',
      pulseColor: 'rgba(168, 85, 247, 0.3)',
    },
    suggestedTopics: [
      'Substrate formulation',
      'Contamination prevention',
      'Environmental controls',
      'Scaling operations',
      'Fruiting conditions',
      'Strain selection',
    ],
    welcomeMessage: 'Ready to optimize your cultivation process',
    orbStyle: 'morphing',
    backgroundStyle: 'cultivation',
    customFeatures: {
      showVisualizer: true,
      showTranscript: false,
      enableRealTimeData: false,
    },
  },
  'sales-director': {
    id: 'sales-director',
    theme: {
      primaryColor: '#10b981', // emerald-500
      secondaryColor: '#22d3ee', // cyan-400
      accentGradient: 'from-emerald-500 to-cyan-400',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      orbGradient: 'from-emerald-500/70 to-cyan-400/50',
      pulseColor: 'rgba(16, 185, 129, 0.3)',
    },
    suggestedTopics: [
      'Lead qualification',
      'CRM integration',
      'Sales pipeline',
      'Follow-up strategy',
      'Deal sizing',
      'Objection handling',
    ],
    welcomeMessage: "Let's qualify and convert your leads",
    orbStyle: 'pulsing',
    backgroundStyle: 'corporate',
    customFeatures: {
      showVisualizer: false,
      showTranscript: true,
      enableRealTimeData: true,
    },
  },
  'ai-strategy': {
    id: 'ai-strategy',
    theme: {
      primaryColor: '#22d3ee', // cyan-400
      secondaryColor: '#8b5cf6', // violet-500
      accentGradient: 'from-cyan-400 to-violet-500',
      glowColor: 'rgba(34, 211, 238, 0.5)',
      orbGradient: 'from-cyan-400/70 to-violet-500/50',
      pulseColor: 'rgba(34, 211, 238, 0.3)',
    },
    suggestedTopics: [
      'LLM selection',
      'Agent architecture',
      'RAG systems',
      'Cost optimization',
      'Infrastructure planning',
      'Model evaluation',
    ],
    welcomeMessage: 'Navigate your AI transformation journey',
    orbStyle: 'animated',
    backgroundStyle: 'default',
    customFeatures: {
      showVisualizer: true,
      showTranscript: false,
      enableRealTimeData: false,
    },
  },
  'extraction': {
    id: 'extraction',
    theme: {
      primaryColor: '#f59e0b', // amber-500
      secondaryColor: '#ec4899', // pink-500
      accentGradient: 'from-amber-500 to-pink-500',
      glowColor: 'rgba(245, 158, 11, 0.5)',
      orbGradient: 'from-amber-500/70 to-pink-500/50',
      pulseColor: 'rgba(245, 158, 11, 0.3)',
    },
    suggestedTopics: [
      'Extraction methods',
      'Solvent selection',
      'Purification techniques',
      'Yield optimization',
      'Safety protocols',
      'Analytical testing',
    ],
    welcomeMessage: 'Master natural product extraction',
    orbStyle: 'standard',
    backgroundStyle: 'scientific',
    customFeatures: {
      showVisualizer: true,
      showTranscript: false,
      enableRealTimeData: false,
    },
  },
  'mycology-research': {
    id: 'mycology-research',
    theme: {
      primaryColor: '#f43f5e', // rose-500
      secondaryColor: '#8b5cf6', // violet-500
      accentGradient: 'from-rose-500 to-violet-500',
      glowColor: 'rgba(244, 63, 94, 0.5)',
      orbGradient: 'from-rose-500/70 to-violet-500/50',
      pulseColor: 'rgba(244, 63, 94, 0.3)',
    },
    suggestedTopics: [
      'Strain genetics',
      'Bioactive compounds',
      'Clinical evidence',
      'Beta-glucans',
      'Triterpenes',
      'Research protocols',
    ],
    welcomeMessage: 'Explore fungal biology and compounds',
    orbStyle: 'morphing',
    backgroundStyle: 'scientific',
    customFeatures: {
      showVisualizer: false,
      showTranscript: false,
      enableRealTimeData: false,
    },
  },
  'computational-chemist': {
    id: 'computational-chemist',
    theme: {
      primaryColor: '#6366f1', // indigo-500
      secondaryColor: '#22d3ee', // cyan-400
      accentGradient: 'from-indigo-500 to-cyan-400',
      glowColor: 'rgba(99, 102, 241, 0.5)',
      orbGradient: 'from-indigo-500/70 to-cyan-400/50',
      pulseColor: 'rgba(99, 102, 241, 0.3)',
    },
    suggestedTopics: [
      'DFT calculations',
      'Molecular dynamics',
      'Virtual screening',
      'Property prediction',
      'Quantum chemistry',
      'Force fields',
    ],
    welcomeMessage: 'Computational chemistry expertise at your service',
    orbStyle: 'animated',
    backgroundStyle: 'molecular',
    customFeatures: {
      showVisualizer: true,
      showTranscript: false,
      enableRealTimeData: false,
    },
  },
  'drug-discovery': {
    id: 'drug-discovery',
    theme: {
      primaryColor: '#10b981', // emerald-500
      secondaryColor: '#3b82f6', // blue-500
      accentGradient: 'from-emerald-500 to-blue-500',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      orbGradient: 'from-emerald-500/70 to-blue-500/50',
      pulseColor: 'rgba(16, 185, 129, 0.3)',
    },
    suggestedTopics: [
      'Target identification',
      'Hit-to-lead',
      'ADMET optimization',
      'Clinical trials',
      'Regulatory pathways',
      'Druggability assessment',
    ],
    welcomeMessage: 'From target to clinic - expert guidance',
    orbStyle: 'pulsing',
    backgroundStyle: 'scientific',
    customFeatures: {
      showVisualizer: false,
      showTranscript: false,
      enableRealTimeData: false,
    },
  },
};

export function getAgentInterfaceConfig(agentId: string): AgentInterfaceConfig | undefined {
  return agentInterfaceConfigs[agentId];
}

export function getAgentTheme(agentId: string): AgentInterfaceTheme | undefined {
  return agentInterfaceConfigs[agentId]?.theme;
}
