'use client';

import { useState } from 'react';
import { AgentRoster } from '@/components/workspace/AgentRoster';
import { workspaceModes, type WorkspaceMode } from '@/data/workspaceAgents';

const SESSIONS = [
  {
    id: 'session-1',
    name: 'Research Intake',
    status: 'Standby',
    owner: 'Voice Console',
  },
  {
    id: 'session-2',
    name: 'Partner Briefing',
    status: 'Queued',
    owner: 'Voice Console',
  },
  {
    id: 'session-3',
    name: 'Executive Summary',
    status: 'Live',
    owner: 'Voice Console',
  },
];

interface VoiceConsolePanelProps {
  mode: WorkspaceMode;
}

export function VoiceConsolePanel({ mode }: VoiceConsolePanelProps) {
  const [routingEnabled, setRoutingEnabled] = useState(true);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);
  const [streamingEnabled, setStreamingEnabled] = useState(false);
  const modeMeta = workspaceModes.find((item) => item.id === mode);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">{modeMeta?.label}</p>
          <h2 className="text-2xl font-semibold text-white mt-2">Live voice orchestration with session-grade telemetry.</h2>
          <p className="text-sm text-white/50 mt-2 max-w-2xl">
            Route ElevenLabs agents, manage transcripts, and keep live sessions on a single command surface.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <ToggleCard
              label="Routing"
              description="Agent routing active"
              enabled={routingEnabled}
              onToggle={() => setRoutingEnabled((prev) => !prev)}
            />
            <ToggleCard
              label="Transcription"
              description="Realtime transcripts"
              enabled={transcriptionEnabled}
              onToggle={() => setTranscriptionEnabled((prev) => !prev)}
            />
            <ToggleCard
              label="Streaming"
              description="Live audio stream"
              enabled={streamingEnabled}
              onToggle={() => setStreamingEnabled((prev) => !prev)}
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <button className="px-4 py-2 rounded-lg border border-[#d4a15f]/40 text-xs uppercase tracking-[0.2em] text-white hover:border-[#d4a15f]">
              Start session
            </button>
            <button className="px-4 py-2 rounded-lg border border-white/10 text-xs uppercase tracking-[0.2em] text-white/60 hover:border-white/30">
              Review transcripts
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {SESSIONS.map((session) => (
            <div key={session.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{session.name}</p>
                  <p className="text-xs text-white/40">{session.owner}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border border-white/20 text-white/70">
                  {session.status}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="px-3 py-2 rounded-lg text-xs uppercase tracking-[0.2em] border border-[#d4a15f]/40 text-white hover:border-[#d4a15f]">
                  Open console
                </button>
                <button className="px-3 py-2 rounded-lg text-xs uppercase tracking-[0.2em] border border-white/10 text-white/60 hover:border-white/30">
                  View notes
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

interface ToggleCardProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleCard({ label, description, enabled, onToggle }: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-xl border p-4 text-left transition ${
        enabled ? 'border-[#d4a15f]/50 bg-[#d4a15f]/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</p>
      <p className="text-sm text-white mt-2">{description}</p>
      <p className="text-xs text-white/40 mt-3">{enabled ? 'Enabled' : 'Disabled'}</p>
    </button>
  );
}
