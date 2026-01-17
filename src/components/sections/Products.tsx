'use client';

import { motion } from 'framer-motion';
import { HolographicCard } from '@/components/ui/HolographicCard';

const products = [
  {
    title: "Mushroom Cultivator's Masterclass",
    subtitle: 'The Complete Guide',
    price: '$499',
    originalPrice: '$899',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    features: ['28 Chapters', '640+ Pages', '46 Hours Video', 'Lifetime Access'],
    gradient: 'from-[#d4a15f] via-[#e2b577] to-[#6fd6cc]',
    link: '/products/masterclass'
  },
  {
    title: 'Drug Discovery Dataset',
    subtitle: '500+ Validated Targets',
    price: '$2,499',
    originalPrice: '$4,999',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    features: ['ChEMBL Validated', 'SMILES Data', 'ML Ready', 'API Access'],
    gradient: 'from-[#6fd6cc] via-[#4fae9e] to-[#d4a15f]',
    link: '/products/dataset'
  },
  {
    title: 'Research Studio Consulting',
    subtitle: 'Crowe Logic Research Studio',
    price: '$5,000',
    originalPrice: null,
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
    features: ['Claude 4.5 Opus', 'Custom Models', '1:1 Sessions', 'Implementation'],
    gradient: 'from-[#d4a15f] via-[#c08e54] to-[#1c1c22]',
    link: '/products/consulting'
  }
];

export function Products() {
  return (
    <section id="products" className="py-32 px-6 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0">
        <div className="section-divider max-w-4xl mx-auto" />
      </div>

      {/* Enhanced background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-[#d4a15f]/18 to-[#6fd6cc]/12 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-[#6fd6cc]/15 to-transparent rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '-8s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="section-kicker justify-center mb-6">Intelligence Assets</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.1]">
            Proprietary products that<br />
            <span className="gradient-text">move faster than the market.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Access the masterclass, datasets, and advisory packages that are powering
            active research programs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <HolographicCard
                className="overflow-hidden group h-full bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500"
                glareColor={i === 1 ? 'cyan' : i === 2 ? 'emerald' : 'amber'}
              >
                {/* Product image placeholder */}
                <div className={`h-52 bg-gradient-to-br ${product.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl"
                      whileHover={{ rotate: 8, scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {product.icon}
                    </motion.div>
                  </div>
                  {product.originalPrice && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className="absolute top-4 right-4 px-4 py-1.5 bg-black/50 backdrop-blur-sm text-[color:var(--accent)] text-[10px] font-bold tracking-[0.25em] rounded-full border border-[color:var(--accent)]/30"
                    >
                      PRICE DROP
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10">
                  <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-[color:var(--accent)] transition-colors duration-300">{product.title}</h3>
                  <p className="text-white/50 text-xs mb-6 font-medium tracking-[0.3em] uppercase">{product.subtitle}</p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-3 mb-8">
                    {product.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2.5 text-sm text-white/70">
                        <div className="w-2 h-2 rounded-full bg-[color:var(--accent-cool)] shadow-[var(--glow-cool)]" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-4xl lg:text-5xl font-display font-bold text-white">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-base text-white/35 line-through decoration-white/30">{product.originalPrice}</span>
                    )}
                  </div>

                  {/* CTA */}
                  <motion.a
                    href={product.link}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(212, 161, 95, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className={`btn-enhanced ripple-effect block w-full py-4 rounded-xl bg-gradient-to-r ${product.gradient} text-white font-bold tracking-[0.2em] uppercase text-center text-sm shadow-lg transition-all duration-300 border border-white/20`}
                  >
                    Access Now
                  </motion.a>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-white/50 text-sm mb-4">Need a custom solution?</p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 text-[color:var(--accent)] font-medium link-underline"
          >
            Schedule a consultation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
