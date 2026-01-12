'use client';

import { useEffect, useRef } from 'react';

interface OrbitBackgroundProps {
  showNoise?: boolean;
  className?: string;
}

export function OrbitBackground({ showNoise = true, className = '' }: OrbitBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size with devicePixelRatio for sharp rendering
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      // Reset transform before scaling to avoid cumulative scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Starfield (use display dimensions for positioning)
    const stars: { x: number; y: number; size: number; opacity: number }[] = [];
    const initialWidth = canvas.getBoundingClientRect().width;
    const initialHeight = canvas.getBoundingClientRect().height;
    
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * initialWidth,
        y: Math.random() * initialHeight,
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    
    const getDisplayWidth = () => canvas.getBoundingClientRect().width;
    const getDisplayHeight = () => canvas.getBoundingClientRect().height;
    
    // Orbit rings
    const rings = [
      { radius: 300, speed: 0.0003, color: 'rgba(34, 211, 238, 0.15)' },
      { radius: 450, speed: 0.0002, color: 'rgba(139, 92, 246, 0.1)' },
      { radius: 600, speed: 0.00015, color: 'rgba(16, 185, 129, 0.08)' },
    ];
    
    let rotation = 0;
    
    const animate = () => {
      const displayWidth = getDisplayWidth();
      const displayHeight = getDisplayHeight();
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      
      // Draw stars
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw orbit rings
      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;
      
      rings.forEach((ring) => {
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 20]);
        ctx.lineDashOffset = rotation * ring.speed * 10000;
        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, ring.radius, ring.radius * 0.3, rotation * ring.speed, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      rotation++;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);
  
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {showNoise && (
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }}
        />
      )}
    </div>
  );
}
