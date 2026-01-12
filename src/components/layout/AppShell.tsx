'use client';

import { OrbitBackground } from '@/components/studio/OrbitBackground';
import { FloatingBlobs } from '@/components/studio/FloatingBlobs';

interface AppShellProps {
  children: React.ReactNode;
  showBackground?: boolean;
  blobCount?: number;
}

export function AppShell({ children, showBackground = true, blobCount = 3 }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Background layers - absolute positioned with z-0 */}
      {showBackground && (
        <>
          <OrbitBackground />
          <FloatingBlobs count={blobCount} />
        </>
      )}
      
      {/* Main content - relative with z-10 to appear above background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
