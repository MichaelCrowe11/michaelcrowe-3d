'use client';

import { workspaceAgents, type WorkspaceMode } from '@/data/workspaceAgents';

interface AgentRosterProps {
  mode: WorkspaceMode;
}

export function AgentRoster({ mode }: AgentRosterProps) {
  const agents = workspaceAgents.filter((agent) => agent.mode === mode);

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Agent Layer</p>
        <h3 className="text-lg font-semibold text-white">Active Agents</h3>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{agent.name}</p>
                <p className="text-xs text-white/50 mt-1">{agent.description}</p>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border ${
                agent.status === 'ready'
                  ? 'border-emerald-400/40 text-emerald-200'
                  : agent.status === 'syncing'
                  ? 'border-amber-400/40 text-amber-200'
                  : 'border-red-400/40 text-red-200'
              }`}>
                {agent.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {agent.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-white/10 text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
