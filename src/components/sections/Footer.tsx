'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center p-1">
                <img src="/crowe-avatar.png" alt="MC" className="w-full h-full object-cover rounded-lg opacity-80" />
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white tracking-wide">Michael Crowe</h4>
                <p className="text-sm text-cyan-500/80 font-medium">AI Consultant & Researcher</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md mb-8 leading-relaxed font-light">
              Pioneering AI solutions in drug discovery and cultivation intelligence.
              Building the future with cutting-edge machine learning and a decade of expertise.
            </p>
            <div className="flex gap-4">
              {['github', 'twitter', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com`}
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300"
                >
                  <span className="text-gray-400 capitalize text-xs font-medium">{social[0].toUpperCase()}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 className="text-white font-display font-semibold mb-6 tracking-wide">Products</h5>
            <ul className="space-y-3">
              {['Masterclass', 'Datasets', 'Consulting', 'API Access'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors font-light hover:pl-2 duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-display font-semibold mb-6 tracking-wide">Company</h5>
            <ul className="space-y-3">
              {['About', 'Contact', 'Blog', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors font-light hover:pl-2 duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-gray-600 text-sm mb-4 md:mb-0 font-light">
            &copy; {new Date().getFullYear()} Crowe Logic, Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm">
            <a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Terms</a>
            <a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
