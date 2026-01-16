'use client';

import { useState, type ReactNode } from 'react';
import { AgentRoster } from '@/components/workspace/AgentRoster';
import { runCroweLogicDoctor } from '@/lib/croweLogicCli';
import { workspaceModes, type WorkspaceMode } from '@/data/workspaceAgents';

const RUNBOOKS = [
  {
    id: 'runbook-market-scan',
    title: 'Market Scan and Competitive Map',
    owner: 'Intelligence Core',
    status: 'Ready',
    steps: ['Collect signals', 'Normalize', 'Rank risks', 'Publish brief'],
  },
  {
    id: 'runbook-product-review',
    title: 'Product Review and Risk Gate',
    owner: 'Platform Reliability',
    status: 'Queued',
    steps: ['Validate telemetry', 'Check regressions', 'Authorize release'],
  },
  {
    id: 'runbook-ops-audit',
    title: 'Ops Audit and Quality Check',
    owner: 'Operations',
    status: 'Live',
    steps: ['Sample logs', 'Flag anomalies', 'Confirm remediation'],
  },
];

interface RunbooksPanelProps {
  mode: WorkspaceMode;
  chat?: ReactNode;
}

export function RunbooksPanel({ mode, chat }: RunbooksPanelProps) {
  const [doctorOutput, setDoctorOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const modeMeta = workspaceModes.find((item) => item.id === mode);
  const hasCli = Boolean(process.env.NEXT_PUBLIC_CROWELOGIC_CLI_API_URL);

  const handleDoctor = async () => {
    if (!hasCli) return;
    setIsRunning(true);
    try {
      const result = await runCroweLogicDoctor();
      setDoctorOutput(result.output || 'No output returned.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to run diagnostics.';
      setDoctorOutput(message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{modeMeta?.label}</p>
          <h2 className="text-2xl font-semibold text-white mt-2">Operational runbooks with audit-grade traceability.</h2>
          <p className="text-sm text-white/50 mt-2 max-w-2xl">
            Coordinate runbook execution across agents, monitor validation gates, and keep outputs ready for distribution.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="button"
              onClick={handleDoctor}
              disabled={!hasCli || isRunning}
              className={`px-4 py-2 rounded-lg border text-xs uppercase tracking-[0.2em] ${
                hasCli
                  ? 'border-[#d4a15f]/40 text-white hover:border-[#d4a15f]'
                  : 'border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isRunning ? 'Running diagnostics' : 'Run CLI diagnostics'}
            </button>
            <span className="text-xs text-white/40 flex items-center">
              {hasCli ? 'CLI endpoint connected' : 'Set NEXT_PUBLIC_CROWELOGIC_CLI_API_URL to enable'}
            </span>
          </div>
          {doctorOutput && (
            <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-white/70 whitespace-pre-wrap">
              {doctorOutput}
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {RUNBOOKS.map((runbook) => (
            <div key={runbook.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{runbook.title}</p>
                  <p className="text-xs text-white/40">{runbook.owner}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-white/20 text-white/70">
                  {runbook.status}
                </span>
              </div>
              <div className="grid gap-2 mt-4">
                {runbook.steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-xs text-white/60">
                    <span className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white/50">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-3 py-2 rounded-lg text-xs uppercase tracking-[0.2em] border border-[#d4a15f]/40 text-white hover:border-[#d4a15f]">
                  Launch
                </button>
                <button className="px-3 py-2 rounded-lg text-xs uppercase tracking-[0.2em] border border-white/10 text-white/60 hover:border-white/30">
                  View output
                </button>
              </div>
            </div>
          ))}
        </div>

        {chat && (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Runbook Chat</p>
              <p className="text-sm text-white/70 mt-1">Coordinate execution with your agents.</p>
            </div>
            <div className="h-[640px]">
              {chat}
            </div>
          </div>
        )}
      </div>

      <AgentRoster mode={mode} />
    </section>
  );
}
