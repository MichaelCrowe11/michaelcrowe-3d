'use client';

interface PillTagProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber';
  className?: string;
}

export function PillTag({ children, variant = 'cyan', className = '' }: PillTagProps) {
  const variantClasses = {
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
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
