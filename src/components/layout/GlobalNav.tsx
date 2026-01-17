"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, TerminalSquare } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/workspace', label: 'Workspace' },
  { href: '/studio', label: 'Studio' },
];

const productLinks = [
  { href: '/products/masterclass', label: 'Masterclass' },
  { href: '/products/dataset', label: 'Dataset' },
  { href: '/products/consulting', label: 'Consulting' },
];

export function GlobalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isWorkspace = pathname?.startsWith('/workspace');

  const triggerWorkspaceToggle = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('workspace:toggle-sidebar'));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050506]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl border border-white/10 bg-white/5" />
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">Crowe Logic</p>
              <p className="text-sm font-semibold text-white">Research Studio</p>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-white/60">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'transition-colors hover:text-white',
                pathname === link.href && 'text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative group">
            <button
              type="button"
              className={clsx(
                'transition-colors hover:text-white',
                pathname?.startsWith('/products') && 'text-white'
              )}
            >
              Products
            </button>
            <div className="absolute left-0 top-full mt-3 w-48 rounded-xl border border-white/10 bg-[#060607] p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {isWorkspace && (
            <button
              type="button"
              onClick={triggerWorkspaceToggle}
              className="hidden sm:flex md:hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:border-white/40"
            >
              <TerminalSquare size={14} className="text-[#d4a15f]" />
              Console
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden rounded-lg border border-white/10 p-2 text-white/70 hover:border-white/40"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#050506] px-5 py-4">
          <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.2em] text-white/60">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'transition-colors hover:text-white',
                  pathname === link.href && 'text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="space-y-2">
              <p className="text-[10px] text-white/30">Products</p>
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-2 py-2 text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {isWorkspace && (
              <button
                type="button"
                onClick={triggerWorkspaceToggle}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/70 hover:border-white/40"
              >
                <TerminalSquare size={14} className="text-[#d4a15f]" />
                Open workspace
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
