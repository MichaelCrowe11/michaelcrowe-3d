export interface AgentPricing {
  perMinute: number;
  packages: { minutes: number; price: number; savings: string }[];
}

export interface Agent {
  id: string;
  elevenLabsAgentId: string;
  name: string;
  tagline: string;
  description: string;
  category: 'life-sciences' | 'ai-strategy' | 'cultivation' | 'custom';
  icon: 'Microscope' | 'Brain' | 'Sprout' | 'Sparkles';
  color: 'emerald' | 'cyan' | 'purple' | 'amber';
  pricing: AgentPricing;
  freeTierMinutes: number;
  isActive: boolean;
}

export const agents: Agent[] = [
  {
    id: 'drug-discovery',
    elevenLabsAgentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_DRUG_DISCOVERY_AGENT || '',
    name: 'Drug Discovery Strategist',
    tagline: 'Target validation to clinical trials',
    description: 'Deep expertise in computational drug discovery, ADMET prediction, and ML-driven lead optimization.',
    category: 'life-sciences',
    icon: 'Microscope',
    color: 'emerald',
    pricing: {
      perMinute: 0.50,
      packages: [
        { minutes: 60, price: 25, savings: '17%' },
        { minutes: 300, price: 100, savings: '33%' },
      ],
    },
    freeTierMinutes: 3,
    isActive: true,
  },
  {
    id: 'ai-strategy',
    elevenLabsAgentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_AI_STRATEGY_AGENT || '',
    name: 'AI Strategy Advisor',
    tagline: 'Enterprise AI implementation',
    description: 'Navigate AI adoption with battle-tested frameworks for enterprise deployment.',
    category: 'ai-strategy',
    icon: 'Brain',
    color: 'cyan',
    pricing: {
      perMinute: 0.75,
      packages: [
        { minutes: 60, price: 40, savings: '11%' },
        { minutes: 300, price: 175, savings: '22%' },
      ],
    },
    freeTierMinutes: 3,
    isActive: true,
  },
  {
    id: 'cultivation-ml',
    elevenLabsAgentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_CULTIVATION_AGENT || '',
    name: 'Cultivation Intelligence',
    tagline: 'ML-powered growing optimization',
    description: 'Commercial cultivation expertise with ML monitoring and contamination prevention.',
    category: 'cultivation',
    icon: 'Sprout',
    color: 'purple',
    pricing: {
      perMinute: 0.40,
      packages: [
        { minutes: 60, price: 20, savings: '17%' },
        { minutes: 300, price: 80, savings: '33%' },
      ],
    },
    freeTierMinutes: 5,
    isActive: true,
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id && a.isActive);
}

export function getActiveAgents(): Agent[] {
  return agents.filter((a) => a.isActive);
}
