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
  category: 'life-sciences' | 'ai-strategy' | 'cultivation' | 'extraction' | 'research' | 'custom';
  icon: 'Microscope' | 'Brain' | 'Sprout' | 'Flask' | 'Dna' | 'Atom' | 'Sparkles';
  color: 'emerald' | 'cyan' | 'purple' | 'amber' | 'rose' | 'indigo';
  pricing: AgentPricing;
  freeTierMinutes: number;
  isActive: boolean;
}

const cultivationAgentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_CULTIVATION_AGENT ?? '';
const salesAgentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_SALES_AGENT ?? '';
const aiStrategyAgentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_AI_STRATEGY_AGENT ?? '';
const extractionAgentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_EXTRACTION_AGENT ?? '';
const mycologyAgentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_MYCOLOGY_AGENT ?? '';
const compChemAgentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_COMP_CHEM_AGENT ?? '';
const drugDiscoveryAgentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_DRUG_DISCOVERY_AGENT ?? '';

export const agents: Agent[] = [
  // Tier 1: Core Revenue Drivers
  {
    id: 'cultivation',
    elevenLabsAgentId: cultivationAgentId,
    name: 'Cultivation Intelligence',
    tagline: 'Commercial mushroom cultivation mastery',
    description: 'Expert guidance on substrate formulation, environmental controls, contamination prevention, and scaling operations from hobby to commercial.',
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
    isActive: Boolean(cultivationAgentId),
  },
  {
    id: 'sales-director',
    elevenLabsAgentId: salesAgentId,
    name: 'Sales Director',
    tagline: 'Automated CRM & Lead Qual',
    description: 'Autonomous sales development representative. Qualifies leads, updates HubSpot CRM in real-time, and schedules follow-ups.',
    category: 'custom',
    icon: 'Sparkles', // Using existing icon type
    color: 'emerald',
    pricing: {
      perMinute: 0.50,
      packages: [
        { minutes: 60, price: 25, savings: '17%' },
        { minutes: 300, price: 100, savings: '33%' },
      ],
    },
    freeTierMinutes: 10,
    isActive: Boolean(salesAgentId),
  },
  {
    id: 'ai-strategy',
    elevenLabsAgentId: aiStrategyAgentId,
    name: 'AI Strategy Advisor',
    tagline: 'Enterprise AI implementation',
    description: 'Navigate AI adoption with battle-tested frameworks. LLM selection, agent architecture, RAG systems, and cost optimization.',
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
    isActive: Boolean(aiStrategyAgentId),
  },
  {
    id: 'extraction',
    elevenLabsAgentId: extractionAgentId,
    name: 'Extraction & Formulation',
    tagline: 'Natural product extraction science',
    description: 'CO2, ethanol, and water extraction optimization. Purification methods, formulation development, and analytical testing.',
    category: 'extraction',
    icon: 'Flask',
    color: 'amber',
    pricing: {
      perMinute: 0.50,
      packages: [
        { minutes: 60, price: 25, savings: '17%' },
        { minutes: 300, price: 100, savings: '33%' },
      ],
    },
    freeTierMinutes: 3,
    isActive: Boolean(extractionAgentId),
  },
  // Tier 2: Specialist Upsells
  {
    id: 'mycology-research',
    elevenLabsAgentId: mycologyAgentId,
    name: 'Mycology Research',
    tagline: 'Fungal biology & bioactive compounds',
    description: 'Strain genetics, medicinal compound research, beta-glucans, triterpenes, and clinical evidence behind medicinal mushrooms.',
    category: 'research',
    icon: 'Dna',
    color: 'rose',
    pricing: {
      perMinute: 0.50,
      packages: [
        { minutes: 60, price: 25, savings: '17%' },
        { minutes: 300, price: 100, savings: '33%' },
      ],
    },
    freeTierMinutes: 3,
    isActive: Boolean(mycologyAgentId),
  },
  {
    id: 'computational-chemist',
    elevenLabsAgentId: compChemAgentId,
    name: 'Computational Chemist',
    tagline: 'Molecular modeling & quantum chemistry',
    description: 'DFT calculations, molecular dynamics, virtual screening, and ML-based property prediction for drug design.',
    category: 'life-sciences',
    icon: 'Atom',
    color: 'indigo',
    pricing: {
      perMinute: 0.75,
      packages: [
        { minutes: 60, price: 40, savings: '11%' },
        { minutes: 300, price: 175, savings: '22%' },
      ],
    },
    freeTierMinutes: 3,
    isActive: Boolean(compChemAgentId),
  },
  {
    id: 'drug-discovery',
    elevenLabsAgentId: drugDiscoveryAgentId,
    name: 'Drug Discovery Specialist',
    tagline: 'Target to clinic pathway',
    description: 'Target identification, druggability assessment, ADMET optimization, and navigating the drug development pipeline.',
    category: 'life-sciences',
    icon: 'Microscope',
    color: 'emerald',
    pricing: {
      perMinute: 0.75,
      packages: [
        { minutes: 60, price: 40, savings: '11%' },
        { minutes: 300, price: 175, savings: '22%' },
      ],
    },
    freeTierMinutes: 3,
    isActive: Boolean(drugDiscoveryAgentId),
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id && a.isActive);
}

export function getActiveAgents(): Agent[] {
  return agents.filter((a) => a.isActive);
}
