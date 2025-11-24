import React, { useState, useEffect } from 'react';

export const MouseSpotlight = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const update = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);
  
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(29, 78, 216, 0.1), transparent 40%)`
      }}
    />
  );
};