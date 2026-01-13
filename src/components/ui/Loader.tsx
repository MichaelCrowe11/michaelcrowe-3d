// 3D Loader
export function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin" />
        <div className="absolute inset-4 border-t-2 border-purple-500 rounded-full animate-spin reverse" />
        <div className="absolute inset-8 border-t-2 border-white/50 rounded-full animate-pulse" />
      </div>
      <div className="absolute mt-40 text-xs font-mono text-cyan-500/50">
        INITIALIZING REALITY...
      </div>
    </div>
  );
}
