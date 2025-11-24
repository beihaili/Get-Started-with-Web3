import React, { useRef, useEffect } from 'react';

export const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!active) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const pieces = [];
    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
    
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: canvas.width / 2, 
        y: canvas.height / 2, 
        w: Math.random() * 10 + 5, 
        h: Math.random() * 10 + 5,
        vx: (Math.random() - 0.5) * 20, 
        vy: (Math.random() - 0.5) * 20 - 10,
        color: colors[Math.floor(Math.random() * colors.length)], 
        gravity: 0.5,
        rotation: Math.random() * 360, 
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activePieces = 0;
      
      pieces.forEach(p => {
        p.x += p.vx; 
        p.y += p.vy; 
        p.vy += p.gravity; 
        p.rotation += p.rotationSpeed;
        
        if (p.y < canvas.height) {
          activePieces++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });
      
      if (activePieces > 0) animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [active]);
  
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};