'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, ProductCardsContainer } from './ProductCard';
import { PurchaseCelebration } from './PurchaseCelebration';

// Product catalog
const PRODUCTS: Record<string, Product> = {
  'prod_TluqOymLTmLRHM': {
    id: 'prod_TluqOymLTmLRHM',
    name: 'AI Consulting Session',
    description: '1-hour consultation on AI integration, automation, or mushroom cultivation',
    price: '$299',
    price_id: 'price_1SoN0WLynR0PTQ0FjXgW1D2K',
  },
  'prod_TluqIRTGNTLkXC': {
    id: 'prod_TluqIRTGNTLkXC',
    name: 'The Mushroom Grower - Digital Edition',
    description: 'Complete digital access to all 28 chapters with lifetime updates',
    price: '$499',
    price_id: 'price_1SoN0VLynR0PTQ0FgDAd7zkh',
  },
  'prod_TVswtN5lJzcvjo': {
    id: 'prod_TVswtN5lJzcvjo',
    name: 'The Mushroom Grower - Premium Hardcover',
    description: '1,400-page professional encyclopedia + digital access + AI contamination detection',
    price: '$899',
    price_id: 'price_1SoN0MLynR0PTQ0FfHPNxEGU',
  },
  'prod_Tlt4EQ1eEP9KTd': {
    id: 'prod_Tlt4EQ1eEP9KTd',
    name: 'Michael Crowe AI - Premium Access',
    description: 'Unlimited conversations with AI assistant, priority response, code generation',
    price: '$29',
    price_id: 'price_1SoLIKLynR0PTQ0FVSCzY7Ly',
  },
};

interface SalesContextType {
  showProduct: (productId: string) => void;
  showProductByName: (name: string) => void;
  hideProduct: (productId: string) => void;
  clearProducts: () => void;
  celebratePurchase: (productName?: string) => void;
  openCheckout: (url: string) => void;
}

const SalesContext = createContext<SalesContextType | null>(null);

export function useSales() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within SalesProvider');
  }
  return context;
}

interface SalesProviderProps {
  children: ReactNode;
}

export function SalesProvider({ children }: SalesProviderProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationProduct, setCelebrationProduct] = useState<string>();

  const showProduct = useCallback((productId: string) => {
    const product = PRODUCTS[productId];
    if (product && !visibleProducts.find(p => p.id === productId)) {
      setVisibleProducts(prev => [...prev, product].slice(-3)); // Max 3 cards
    }
  }, [visibleProducts]);

  const showProductByName = useCallback((name: string) => {
    const lowerName = name.toLowerCase();
    const product = Object.values(PRODUCTS).find(p =>
      p.name.toLowerCase().includes(lowerName) ||
      lowerName.includes(p.name.toLowerCase().split(' ')[0])
    );
    if (product) {
      showProduct(product.id);
    }
  }, [showProduct]);

  const hideProduct = useCallback((productId: string) => {
    setVisibleProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearProducts = useCallback(() => {
    setVisibleProducts([]);
  }, []);

  const celebratePurchase = useCallback((productName?: string) => {
    setCelebrationProduct(productName);
    setShowCelebration(true);
  }, []);

  const openCheckout = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  const handleBuy = useCallback(async (product: Product) => {
    if (!product.price_id) return;

    try {
      // Create checkout session
      const response = await fetch('/api/mcp/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          id: Date.now(),
          params: {
            name: 'create_checkout_session',
            arguments: { price_id: product.price_id },
          },
        }),
      });

      const data = await response.json();
      const result = JSON.parse(data.result?.content?.[0]?.text || '{}');

      if (result.checkout_url) {
        window.open(result.checkout_url, '_blank');
        hideProduct(product.id);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  }, [hideProduct]);

  return (
    <SalesContext.Provider
      value={{
        showProduct,
        showProductByName,
        hideProduct,
        clearProducts,
        celebratePurchase,
        openCheckout,
      }}
    >
      {children}

      {/* Product Cards UI */}
      <ProductCardsContainer
        products={visibleProducts}
        onBuy={handleBuy}
        onDismiss={hideProduct}
      />

      {/* Purchase Celebration */}
      <PurchaseCelebration
        show={showCelebration}
        productName={celebrationProduct}
        onComplete={() => setShowCelebration(false)}
      />
    </SalesContext.Provider>
  );
}
