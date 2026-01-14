'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HolographicCard } from '../ui/HolographicCard';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  price_id: string | null;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  onClose: () => void;
}

export function ProductCard({ product, onBuy, onClose }: ProductCardProps) {
  // Get product visual based on type
  const getProductVisual = (name: string): { icon: React.ReactNode; gradient: string; badge?: string } => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hardcover') || lowerName.includes('premium')) {
      return {
        icon: (
          <svg className="w-16 h-16 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6.75 4.5h9a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0115.75 19.5h-9A2.25 2.25 0 014.5 17.25V6.75A2.25 2.25 0 016.75 4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 7.5h6M9 11.25h6M9 15h4.5" />
          </svg>
        ),
        gradient: 'from-[#d4a15f]/40 to-[#8f6a3f]/40',
        badge: 'PREMIUM',
      };
    }
    if (lowerName.includes('digital')) {
      return {
        icon: (
          <svg className="w-16 h-16 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4.5 6.75h15a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 15.75v-7.5a1.5 1.5 0 011.5-1.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8.25 19.5h7.5" />
          </svg>
        ),
        gradient: 'from-[#6fd6cc]/40 to-[#2f7f77]/40',
        badge: 'DIGITAL',
      };
    }
    if (lowerName.includes('consult')) {
      return {
        icon: (
          <svg className="w-16 h-16 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="7" strokeWidth={1.6} />
            <circle cx="12" cy="12" r="3" strokeWidth={1.6} />
          </svg>
        ),
        gradient: 'from-[#d4a15f]/40 to-[#1c1c22]/40',
        badge: '1:1',
      };
    }
    if (lowerName.includes('ai') || lowerName.includes('access')) {
      return {
        icon: (
          <svg className="w-16 h-16 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7.5 8.25h9A2.25 2.25 0 0118.75 10.5v6.75A2.25 2.25 0 0116.5 19.5h-9A2.25 2.25 0 015.25 17.25V10.5A2.25 2.25 0 017.5 8.25z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12h.01M15 12h.01M8.25 6.75h7.5" />
          </svg>
        ),
        gradient: 'from-[#6fd6cc]/40 to-[#3a7c73]/40',
        badge: 'AGENT',
      };
    }
    return {
      icon: (
        <svg className="w-16 h-16 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 6c-4.5 0-8 2.25-8 5.25 0 2.25 2.1 4.15 5.25 4.95V18a2.75 2.75 0 005.5 0v-1.8C17.9 15.4 20 13.5 20 11.25 20 8.25 16.5 6 12 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M10.5 18h3" />
        </svg>
      ),
      gradient: 'from-[#1c1c22]/30 to-[#6a4e2d]/30',
    };
  };

  const visual = getProductVisual(product.name);

  // Map to HolographicCard glare colors
  const getGlare = () => {
    if (visual.gradient.includes('#d4a15f')) return 'amber';
    if (visual.gradient.includes('#6fd6cc')) return 'emerald';
    return 'cyan';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="w-80"
    >
      <HolographicCard 
        glareColor={getGlare()}
        className="w-full"
      >
        {/* Product Visual */}
        <div className={`relative h-40 bg-gradient-to-br ${visual.gradient}`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
          </div>

          {/* Product icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="drop-shadow-lg"
            >
              {visual.icon}
            </motion.div>
          </div>

          {/* Badge */}
          {visual.badge && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-bold shadow-sm border border-white/10">
              {visual.badge}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-white/60 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#d4a15f] to-[#6fd6cc] bg-clip-text text-transparent">
              {product.price}
            </span>

            {product.price_id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBuy(product)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4a15f] to-[#6fd6cc] text-black font-semibold shadow-lg shadow-[0_12px_30px_rgba(212,161,95,0.2)] hover:shadow-[0_16px_34px_rgba(212,161,95,0.3)] transition-shadow z-20 relative pointer-events-auto"
              >
                Continue
              </motion.button>
            )}
          </div>
        </div>
      </HolographicCard>
    </motion.div>
  );
}

interface ProductCardsContainerProps {
  products: Product[];
  onBuy: (product: Product) => void;
  onDismiss: (productId: string) => void;
}

export function ProductCardsContainer({ products, onBuy, onDismiss }: ProductCardsContainerProps) {
  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-24 z-40 flex flex-col gap-3 items-center md:items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <div key={product.id} className="pointer-events-auto w-full max-w-sm">
            <ProductCard
              product={product}
              onBuy={onBuy}
              onClose={() => onDismiss(product.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
