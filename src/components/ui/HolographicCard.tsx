'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string; // Additional classes for the OUTER container
  onClick?: () => void;
  glareColor?: string; // e.g. "cyan", "emerald", "purple"
  enableTilt?: boolean;
}

export function HolographicCard({ 
  children, 
  className = "", 
  onClick,
  glareColor = "cyan",
  enableTilt = true 
}: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for sheen
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const xSpring = useSpring(0, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative coordinates (0 to 1) for sheen
    const xPct = (e.clientX - rect.left) / width;
    const yPct = (e.clientY - rect.top) / height;

    mouseX.set(xPct);
    mouseY.set(yPct);

    if (enableTilt) {
      // Tilt logic (-10deg to 10deg)
      const rotateX = ((yPct - 0.5) * 20) * -1; // Invert logic for natural feel
      const rotateY = (xPct - 0.5) * 20;

      xSpring.set(rotateX);
      ySpring.set(rotateY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    xSpring.set(0);
    ySpring.set(0);
  };

  const transform = useMotionTemplate`perspective(1000px) rotateX(${xSpring}deg) rotateY(${ySpring}deg) scale3d(1, 1, 1)`;
  
  const sheenGradient = useMotionTemplate`radial-gradient(
    400px circle at ${mouseX.get() * 100}% ${mouseY.get() * 100}%,
    rgba(255, 255, 255, 0.15),
    transparent 80%
  )`;
  
  // Map glare color name to rgba
  const getGlareRGBA = (color: string) => {
    switch(color) {
        case 'emerald': return 'rgba(16, 185, 129, 0.6)';
        case 'purple': return 'rgba(168, 85, 247, 0.6)';
        case 'amber': return 'rgba(245, 158, 11, 0.6)';
        case 'rose': return 'rgba(244, 63, 94, 0.6)';
        case 'indigo': return 'rgba(99, 102, 241, 0.6)';
        default: return 'rgba(34, 211, 238, 0.6)'; // cyan
    }
  };

  const borderGradient = useMotionTemplate`radial-gradient(
    200px circle at ${mouseX.get() * 100}% ${mouseY.get() * 100}%,
    ${getGlareRGBA(glareColor)},
    transparent 100%
  )`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        transform: enableTilt ? transform : undefined,
      }}
      className={`relative group rounded-2xl transition-all duration-300 ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Dynamic Border Glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: borderGradient }}
      />
      
      {/* Background & Content Container */}
      <div className="relative h-full w-full rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
        
        {/* Iridescent/Holographic Background Overlay with Noise */}
        <div 
            className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-overlay"
            style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
        
        {/* Dynamic Sheen/Glare */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 will-change-transform"
          style={{ background: sheenGradient }}
        />

        {/* Content */}
        <div className="relative z-10 h-full p-5">
            {children}
        </div>
      </div>
    </motion.div>
  );
}
