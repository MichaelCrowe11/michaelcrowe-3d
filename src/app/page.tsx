'use client';

import { StudioHero } from '@/components/studio/StudioHero';
import { SalesProvider } from '@/components/sales/SalesProvider';

export default function Home() {
  return (
    <SalesProvider>
      <main className="relative min-h-screen bg-[#060607]">
        <StudioHero />
      </main>
    </SalesProvider>
  );
}
