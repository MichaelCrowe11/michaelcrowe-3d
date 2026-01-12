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
  const getProductVisual = (name: string): { icon: string; gradient: string; badge?: string } => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hardcover') || lowerName.includes('premium')) {
      return {
        icon: '📚',
        gradient: 'from-amber-600/40 to-orange-700/40',
        badge: 'PREMIUM',
      };
    }
    if (lowerName.includes('digital')) {
      return {
        icon: '💻',
        gradient: 'from-blue-600/40 to-cyan-600/40',
        badge: 'DIGITAL',
      };
    }
    if (lowerName.includes('consult')) {
      return {
        icon: '🎯',
        gradient: 'from-purple-600/40 to-pink-600/40',
        badge: '1:1',
      };
    }
    if (lowerName.includes('ai') || lowerName.includes('access')) {
      return {
        icon: '🤖',
        gradient: 'from-emerald-600/40 to-teal-600/40',
        badge: 'AI',
      };
    }
    return {
      icon: '🍄',
      gradient: 'from-cyan-900/30 to-emerald-900/30',
    };
  };

  const visual = getProductVisual(product.name);

  // Map to HolographicCard glare colors
  const getGlare = () => {
    if (visual.gradient.includes('amber')) return 'amber';
    if (visual.gradient.includes('purple')) return 'purple';
    if (visual.gradient.includes('emerald')) return 'emerald';
    if (visual.gradient.includes('rose')) return 'rose';
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
              className="text-7xl drop-shadow-lg"
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
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {product.price}
            </span>

            {product.price_id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBuy(product)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow z-20 relative pointer-events-auto"
              >
                Buy Now
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
