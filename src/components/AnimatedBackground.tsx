import React from 'react';
import { useLocation } from 'react-router-dom';

export default function AnimatedBackground() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-bg-primary transition-colors duration-300">
      {/* GIF Background Theme */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 mix-blend-screen dark:mix-blend-screen light:mix-blend-multiply ${isHome ? 'opacity-40 md:hidden' : 'opacity-10'}`}
        style={{ backgroundImage: 'url("https://i0.wp.com/trade360.ai/wp-content/uploads/2023/10/Untitled-design-1.gif?fit=600%2C400&ssl=1")' }}
      />
      
      {/* Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/90 via-bg-primary/70 to-bg-primary/95 transition-colors duration-300" />
      <div className="absolute inset-0 bg-vignette opacity-80 dark:opacity-80 light:opacity-20" />
    </div>
  );
}
