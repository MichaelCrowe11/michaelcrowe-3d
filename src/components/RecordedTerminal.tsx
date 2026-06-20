'use client';
/* Crowe Logic recorded-terminal, the DeepParallel signature.
   Wraps the zero-dependency web component (public/recorded-terminal.js). */
import { useEffect } from 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'recorded-terminal': any;
    }
  }
}

let loader: Promise<void> | null = null;
function ensureComponent(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).customElements?.get('recorded-terminal')) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise<void>((resolve) => {
    const s = document.createElement('script');
    s.src = '/recorded-terminal.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
  return loader;
}

export function RecordedTerminal({
  src,
  title,
  badge,
  badgeKind = 'ok',
}: {
  src: string;
  title?: string;
  badge?: string;
  badgeKind?: 'ok' | 'warn' | 'bad';
}) {
  useEffect(() => {
    ensureComponent();
  }, []);
  return (
    <recorded-terminal src={src} title={title} badge={badge} badge-kind={badgeKind} prompt="❯" />
  );
}
