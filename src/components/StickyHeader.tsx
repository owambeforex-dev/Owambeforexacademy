import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StickyHeaderProps {
  title: string;
}

export default function StickyHeader({ title }: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Trigger after 100px scroll
      if (scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-base shadow-sm h-14 flex items-center"
        >
          <div className="container mx-auto px-4 flex items-center relative">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors z-10"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="text-sm md:text-base font-bold text-text-primary truncate max-w-[60%]">
                {title}
              </h2>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
