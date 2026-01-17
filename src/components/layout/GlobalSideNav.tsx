"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Home, LayoutGrid, Orbit, BookOpen, Database, Briefcase } from 'lucide-react';

const primaryLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/workspace', label: 'Workspace', icon: LayoutGrid },
  { href: '/studio', label: 'Studio', icon: Orbit },
  { href: '/products/masterclass', label: 'Masterclass', icon: BookOpen },
  { href: '/products/dataset', label: 'Dataset', icon: Database },
  { href: '/products/consulting', label: 'Consulting', icon: Briefcase },
];

export function GlobalSideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-20 md:w-24 border-r border-white/10 bg-[#050506]/95 backdrop-blur-xl">
      <div className="flex h-full flex-col items-center justify-between py-6">
        <div className="flex flex-col items-center gap-6">
          <Link href="/" className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5" />
            <div className="hidden md:block text-center">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Crowe Logic</p>
              <p className="text-xs font-semibold text-white">Research Studio</p>
            </div>
          </Link>

          <nav className="flex flex-col gap-3">
            {primaryLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'group flex h-11 w-11 items-center justify-center rounded-xl border transition',
                    isActive
                      ? 'border-[#d4a15f]/50 bg-[#d4a15f]/15 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                  )}
                >
                  <Icon size={18} className={isActive ? 'text-[#d4a15f]' : ''} />
                  <span className="sr-only">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
          <div className="h-8 w-8 rounded-full border border-white/10 bg-white/5" />
          <span className="hidden md:block">Control</span>
        </div>
      </div>
    </aside>
  );
}
