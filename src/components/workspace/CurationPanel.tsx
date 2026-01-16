'use client';

import { AgentRoster } from '@/components/workspace/AgentRoster';
import { workspaceModes, type WorkspaceMode } from '@/data/workspaceAgents';

const PIPELINES = [
  {
    id: 'pipeline-chem',
    name: 'Compound Validation Pipeline',
    status: 'Active',
    sources: ['ChEMBL', 'PubChem', 'Internal assays'],
    outputs: ['Curated SMILES', 'Confidence scores', 'Export bundle'],
  },
  {
    id: 'pipeline-market',
    name: 'Market Signal Corpus',
    status: 'Queued',
    sources: ['Competitor feeds', 'Partnership intel', 'Pricing updates'],
    outputs: ['Brief drafts', 'Trend alerts', 'Risk flags'],
  },
  {
    id: 'pipeline-ops',
    name: 'Operational Telemetry Dataset',
    status: 'Standby',
    sources: ['Platform logs', 'Reliability KPIs', 'Usage traces'],
    outputs: ['Daily rollups', 'Anomaly tables', 'Reliability report'],
  },
];

interface CurationPanelProps {
  mode: WorkspaceMode;
}

export function CurationPanel({ mode }: CurationPanelProps) {
  const modeMeta = workspaceModes.find((item) => item.id === mode);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{modeMeta?.label}</p>
          <h2 className="text-2xl font-semibold text-white mt-2">Precision curation with export-ready packaging.</h2>
          <p className="text-sm text-white/50 mt-2 max-w-2xl">
            Centralize ingestion, validation, and delivery of your research-grade datasets.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button className="px-4 py-2 rounded-lg border border-[#6fd6cc]/40 text-xs uppercase tracking-[0.2em] text-white hover:border-[#6fd6cc]">
              Start ingestion
            </button>
            <button className="px-4 py-2 rounded-lg border border-white/10 text-xs uppercase tracking-[0.2em] text-white/60 hover:border-white/30">
              Export bundle
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {PIPELINES.map((pipeline) => (
            <div key={pipeline.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{pipeline.name}</p>
                  <p className="text-xs text-white/40">{pipeline.status}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-white/20 text-white/70">
                  {pipeline.status}
                </span>
              </div>
              <div className="grid gap-3 mt-4">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Sources</p>
                  <p className="text-xs text-white/70 mt-1">{pipeline.sources.join(' | ')}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Outputs</p>
                  <p className="text-xs text-white/70 mt-1">{pipeline.outputs.join(' | ')}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-3 py-2 rounded-lg text-xs uppercase tracking-[0.2em] border border-[#6fd6cc]/40 text-white hover:border-[#6fd6cc]">
                  Review
                </button>
                <button className="px-3 py-2 rounded-lg text-xs uppercase tracking-[0.2em] border border-white/10 text-white/60 hover:border-white/30">
                  Queue export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AgentRoster mode={mode} />
    </section>
  );
}
