import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell } from 'lucide-react';

const NOTIFICATIONS = [
  "Daniel from 🇳🇬 just joined the 3 Month Mentorship.",
  "Emily from 🇨🇦 purchased Premium Signals.",
  "Kwame from 🇬🇭 passed his $100k Prop Firm Challenge.",
  "Sarah from 🇬🇧 invested in the 30% ROI Program.",
  "Yuki from 🇯🇵 joined the 1 Year Mentorship.",
  "Alex from 🇺🇸 started Account Management.",
  "Maria from 🇪🇸 renewed Premium Signals.",
  "David from 🇿🇦 joined the 6 Month Mentorship."
];

export default function LiveNotifications() {
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);

  useEffect(() => {
    const showNotification = () => {
      const randomNotification = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
      setCurrentNotification(randomNotification);

      // Hide after 5 seconds
      setTimeout(() => {
        setCurrentNotification(null);
      }, 5000);
    };

    // Initial delay
    const initialTimeout = setTimeout(showNotification, 10000);

    // Repeat every 20-40 seconds
    const interval = setInterval(() => {
      showNotification();
    }, Math.floor(Math.random() * 20000) + 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-surface border border-border-base rounded-xl p-4 shadow-2xl shadow-brand-primary/10 flex items-center gap-4 max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
              <Bell size={18} className="animate-pulse" />
            </div>
            <p className="text-sm font-medium text-text-primary leading-tight">
              {currentNotification}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
