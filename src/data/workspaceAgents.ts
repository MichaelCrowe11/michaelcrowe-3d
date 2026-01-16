export type WorkspaceMode = 'runbooks' | 'curation' | 'voice';

export type AgentExecution = 'cli' | 'elevenlabs' | 'api';

export interface WorkspaceAgent {
  id: string;
  name: string;
  mode: WorkspaceMode;
  execution: AgentExecution;
  description: string;
  status: 'ready' | 'offline' | 'syncing';
  tags: string[];
}

export const workspaceModes: Array<{ id: WorkspaceMode; label: string; summary: string }> = [
  {
    id: 'runbooks',
    label: 'Agent Runbooks',
    summary: 'Operational sequences, validation checks, and audit trails.',
  },
  {
    id: 'curation',
    label: 'Dataset Curation',
    summary: 'Source ingestion, validation, and export pipelines.',
  },
  {
    id: 'voice',
    label: 'Voice Console',
    summary: 'Live agent sessions, transcript routing, and voice operations.',
  },
];

export const workspaceAgents: WorkspaceAgent[] = [
  {
    id: 'runbook-orchestrator',
    name: 'Runbook Orchestrator',
    mode: 'runbooks',
    execution: 'cli',
    description: 'Executes analytical runbooks with step validation and audit outputs.',
    status: 'ready',
    tags: ['workflow', 'analysis', 'audit'],
  },
  {
    id: 'dataset-curator',
    name: 'Dataset Curator',
    mode: 'curation',
    execution: 'cli',
    description: 'Cleans, validates, and packages research datasets for export.',
    status: 'ready',
    tags: ['data', 'validation', 'export'],
  },
  {
    id: 'voice-console',
    name: 'Voice Console',
    mode: 'voice',
    execution: 'elevenlabs',
    description: 'Routes voice sessions, transcripts, and live agent controls.',
    status: 'ready',
    tags: ['voice', 'session', 'controls'],
  },
];
