import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Users } from 'lucide-react';

export default function SmartScarcity() {
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 5, minutes: 30, seconds: 0 });
  const [slots, setSlots] = useState({
    '1 Month': 30,
    '3 Month': 30,
    '6 Month': 20,
    '1 Year': 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    const slotTimer = setInterval(() => {
      setSlots((prev) => {
        const keys = Object.keys(prev) as (keyof typeof prev)[];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        if (prev[randomKey] > 0 && Math.random() > 0.7) {
          return { ...prev, [randomKey]: prev[randomKey] - 1 };
        }
        return prev;
      });
    }, 15000); // Randomly decrease slots every 15s

    return () => {
      clearInterval(timer);
      clearInterval(slotTimer);
    };
  }, []);

  return (
    <section className="py-16 bg-bg-primary border-y border-border-base relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-error/10 text-error border border-error/20 mb-6">
              <Clock size={16} className="animate-pulse" />
              <span className="text-sm font-bold tracking-wider uppercase">Next Cohort Closing Soon</span>
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4 text-text-primary">Limited Mentorship Slots Available</h2>
            <p className="text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8">
              To ensure quality education and personalized attention, we strictly limit the number of students per cohort. Secure your spot before they're gone.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-surface rounded-xl flex items-center justify-center text-3xl md:text-4xl font-mono font-bold text-brand-primary border border-border-base shadow-lg shadow-brand-primary/5">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-text-muted uppercase tracking-widest mt-2">{unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="bg-surface rounded-2xl p-6 border border-border-base">
              <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2 text-text-primary">
                <Users size={20} className="text-brand-primary" />
                Remaining Availability
              </h3>
              <div className="space-y-4">
                {Object.entries(slots).map(([plan, count]) => (
                  <div key={plan} className="bg-bg-secondary rounded-xl p-4 border border-border-base relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-brand-primary/10 transition-all duration-1000 ease-out"
                      style={{ width: `${((count as number) / 30) * 100}%` }}
                    />
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="font-medium text-text-primary">{plan} Mentorship</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${(count as number) < 10 ? 'text-error' : 'text-brand-primary'}`}>
                          {count as number}
                        </span>
                        <span className="text-sm text-text-muted">slots left</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
