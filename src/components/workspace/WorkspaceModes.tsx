import { workspaceModes, type WorkspaceMode } from '@/data/workspaceAgents';

interface WorkspaceModesProps {
  activeMode: WorkspaceMode;
  onSelectMode: (mode: WorkspaceMode) => void;
}

export function WorkspaceModes({ activeMode, onSelectMode }: WorkspaceModesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {workspaceModes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onSelectMode(mode.id)}
          className={`px-4 py-2 rounded-xl border text-xs uppercase tracking-[0.2em] transition ${
            activeMode === mode.id
              ? 'border-[#d4a15f]/60 text-white bg-[#d4a15f]/10'
              : 'border-white/10 text-white/50 hover:border-white/30'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
