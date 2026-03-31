'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/10 bg-black/50 backdrop-blur-xl relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center p-1">
                <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover rounded-lg opacity-80" />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white tracking-wide">Crowe Logic</h4>
                <p className="text-sm text-white/50 font-medium">Research Intelligence Studio</p>
              </div>
            </div>
            <p className="text-white/55 max-w-md mb-8 leading-relaxed font-light">
              We build applied intelligence systems for life sciences, cultivation, and
              operational decisioning. Precision, speed, and measurable outcomes.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'github', url: 'https://github.com' },
                { name: 'twitter', url: 'https://twitter.com' },
                { name: 'linkedin', url: 'https://linkedin.com' },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_18px_rgba(212,161,95,0.25)] transition-all duration-300"
                >
                  <span className="text-white/60 capitalize text-xs font-medium">{social.name[0].toUpperCase()}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h5 className="text-white font-display font-semibold mb-6 tracking-wide">Products</h5>
            <ul className="space-y-3">
              {[
                { label: 'AI Tools Access', href: '/#pricing' },
                { label: 'Masterclass', href: '/products/masterclass' },
                { label: 'Datasets', href: '/products/dataset' },
                { label: 'Consulting', href: '/products/consulting' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-white/50 hover:text-white transition-colors font-light hover:pl-2 duration-200">
                    {item.label}
                    {item.label === 'AI Tools Access' && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-[color:var(--accent)]/20 text-[color:var(--accent)] font-medium align-middle">NEW</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-display font-semibold mb-6 tracking-wide">Company</h5>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '#' },
                { label: 'Contact', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Careers', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-white/50 hover:text-white transition-colors font-light hover:pl-2 duration-200">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-white/40 text-sm mb-4 md:mb-0 font-light">
            &copy; {new Date().getFullYear()} Crowe Logic, Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm">
            <a href="#" className="text-white/40 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
