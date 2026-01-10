'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Michael Crowe</h4>
                <p className="text-sm text-gray-400">AI Consultant & Researcher</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              Pioneering AI solutions in drug discovery and cultivation intelligence.
              Building the future with cutting-edge machine learning and a decade of expertise.
            </p>
            <div className="flex gap-4">
              {['github', 'twitter', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com`}
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-500/50 transition-colors"
                >
                  <span className="text-gray-400 capitalize text-xs">{social[0].toUpperCase()}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 className="text-white font-semibold mb-4">Products</h5>
            <ul className="space-y-3">
              {['Masterclass', 'Datasets', 'Consulting', 'API Access'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-4">Company</h5>
            <ul className="space-y-3">
              {['About', 'Contact', 'Blog', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Crowe Logic, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
