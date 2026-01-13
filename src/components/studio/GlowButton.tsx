'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function GlowButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: GlowButtonProps) {
  const baseClasses = 'font-semibold rounded-full transition-all duration-300 relative overflow-hidden group tracking-[0.08em] uppercase text-[11px] sm:text-xs';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#d0a980] via-[#8fcab9] to-[#5bc9d6] text-white/95 shadow-[0_18px_40px_-20px_rgba(208,169,128,0.7)] hover:shadow-[0_22px_50px_-22px_rgba(91,201,214,0.6)]',
    secondary: 'glass-button text-white/80 hover:text-white border border-white/10',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-10 py-5 text-sm sm:text-base',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, boxShadow: variant === 'primary' ? '0 0 50px rgba(91,201,214,0.35)' : undefined }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.button>
  );
}
