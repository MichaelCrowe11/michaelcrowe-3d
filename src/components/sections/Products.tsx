'use client';

import { motion } from 'framer-motion';

const products = [
  {
    title: 'Mushroom Cultivator\'s Masterclass',
    subtitle: 'The Complete Guide',
    price: '$499',
    originalPrice: '$899',
    image: '/products/masterclass.png',
    features: ['28 Chapters', '640+ Pages', '46 Hours Video', 'Lifetime Access'],
    gradient: 'from-emerald-500 to-teal-600',
    link: '/products/masterclass'
  },
  {
    title: 'Drug Discovery Dataset',
    subtitle: '500+ Validated Targets',
    price: '$2,499',
    originalPrice: '$4,999',
    image: '/products/dataset.png',
    features: ['ChEMBL Validated', 'SMILES Data', 'ML Ready', 'API Access'],
    gradient: 'from-cyan-500 to-blue-600',
    link: '/products/dataset'
  },
  {
    title: 'AI Consultation Package',
    subtitle: 'Enterprise Solutions',
    price: '$5,000',
    originalPrice: null,
    image: '/products/consulting.png',
    features: ['Claude 4.5 Opus', 'Custom Models', '1:1 Sessions', 'Implementation'],
    gradient: 'from-violet-500 to-purple-600',
    link: '/products/consulting'
  }
];

export function Products() {
  return (
    <section id="products" className="py-32 px-6 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium <span className="gradient-text">Products</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Exclusive access to proprietary research, datasets, and expertise built over a decade.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className="glass-card overflow-hidden group"
            >
              {/* Product image placeholder */}
              <div className={`h-48 bg-gradient-to-br ${product.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <span className="text-5xl">
                      {i === 0 ? '🍄' : i === 1 ? '🧬' : '🤖'}
                    </span>
                  </motion.div>
                </div>
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    SALE
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.subtitle}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {product.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-white">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>

                {/* CTA */}
                <motion.a
                  href={product.link}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full py-3 rounded-xl bg-gradient-to-r ${product.gradient} text-white font-semibold text-center hover:opacity-90 transition-opacity`}
                >
                  Get Started
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
