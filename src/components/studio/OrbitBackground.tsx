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
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Starfield
    const stars: { x: number; y: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    
    // Orbit rings
    const rings = [
      { radius: 280, speed: 0.0003, color: 'rgba(208, 169, 128, 0.14)' },
      { radius: 420, speed: 0.0002, color: 'rgba(91, 201, 214, 0.12)' },
      { radius: 560, speed: 0.00015, color: 'rgba(122, 212, 181, 0.1)' },
    ];
    
    let rotation = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw orbit rings
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
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
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
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
