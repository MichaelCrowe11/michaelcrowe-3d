'use client';

import { StudioHero } from '@/components/studio/StudioHero';
import { SalesProvider } from '@/components/sales/SalesProvider';

export default function Home() {
  return (
    <SalesProvider>
      <StudioHero />
    </SalesProvider>
  );
}

