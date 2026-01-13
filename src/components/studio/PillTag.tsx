'use client';

interface PillTagProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'sky' | 'emerald' | 'amber';
  className?: string;
}

export function PillTag({ children, variant = 'cyan', className = '' }: PillTagProps) {
  const variantClasses = {
    cyan: 'bg-cyan-400/15 text-cyan-200 border-cyan-300/30',
    sky: 'bg-sky-400/15 text-sky-200 border-sky-300/30',
    emerald: 'bg-emerald-400/15 text-emerald-200 border-emerald-300/30',
    amber: 'bg-amber-400/15 text-amber-200 border-amber-300/30',
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

interface PriceChipProps {
  price: string;
  className?: string;
}

export function PriceChip({ price, className = '' }: PriceChipProps) {
  return (
    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full glass-button text-xs font-semibold text-white/90 ${className}`}>
      {price}
    </div>
  );
}
