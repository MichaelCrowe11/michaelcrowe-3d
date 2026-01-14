'use client';

interface PillTagProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'sky' | 'emerald' | 'amber';
  className?: string;
}

export function PillTag({ children, variant = 'cyan', className = '' }: PillTagProps) {
  const variantClasses = {
    cyan: 'bg-[#6fd6cc]/15 text-[#b7f1e9] border-[#6fd6cc]/30',
    sky: 'bg-[#6fd6cc]/15 text-[#b7f1e9] border-[#6fd6cc]/30',
    emerald: 'bg-[#6fd6cc]/15 text-[#b7f1e9] border-[#6fd6cc]/30',
    amber: 'bg-[#d4a15f]/15 text-[#f1d2a8] border-[#d4a15f]/30',
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
