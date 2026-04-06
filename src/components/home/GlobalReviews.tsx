import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Daniel O.', country: '🇳🇬', text: 'The signals completely changed my trading psychology. I am now consistently profitable.', rating: 5 },
  { name: 'Emily R.', country: '🇨🇦', text: 'Premium signals are incredibly accurate. The risk management advice is top-notch.', rating: 5 },
  { name: 'Kwame A.', country: '🇬🇭', text: 'Passed my prop firm challenge on the first try thanks to their evaluation service.', rating: 5 },
  { name: 'James T.', country: '🇬🇧', text: 'The account management service is transparent and the returns are consistent.', rating: 5 },
  { name: 'Aisha M.', country: '🇰🇪', text: 'Best forex academy in Africa. The live classes are very detailed and easy to understand.', rating: 5 },
  { name: 'Michael S.', country: '🇺🇸', text: 'I was struggling with consistency for years until I joined the investment program.', rating: 5 },
  { name: 'Chen W.', country: '🇸🇬', text: 'Highly professional team. The investment program has been delivering exactly as promised.', rating: 5 },
  { name: 'Fatima Z.', country: '🇦🇪', text: 'The signals are very clear with exact entry, stop loss, and take profit levels.', rating: 5 },
  { name: 'Lucas M.', country: '🇧🇷', text: 'Excellent support and community. The daily market breakdowns are invaluable.', rating: 5 },
  { name: 'Sophie L.', country: '🇫🇷', text: 'I started as a complete beginner and now I trade with confidence. Thank you Owambe!', rating: 5 },
];

const ReviewCard: React.FC<{ review: typeof REVIEWS[0] }> = ({ review }) => (
  <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border-base w-[280px] sm:w-[350px] flex-shrink-0 mx-2 sm:mx-4 overflow-hidden">
    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl sm:text-2xl border border-brand-primary/20 flex-shrink-0">
        {review.country}
      </div>
      <div className="overflow-hidden">
        <h4 className="font-semibold text-text-primary text-[10px] md:text-base truncate">{review.name}</h4>
        <div className="flex gap-1 text-brand-primary">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={10} className="sm:w-3.5 sm:h-3.5" fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-text-secondary text-[10px] md:text-sm leading-relaxed italic whitespace-normal break-words">"{review.text}"</p>
  </div>
);

export default function GlobalReviews() {
  const topRow = REVIEWS.slice(0, 5);
  const bottomRow = REVIEWS.slice(5, 10);

  return (
    <section className="py-24 bg-bg-primary overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-xl md:text-5xl font-serif font-bold mb-4 text-text-primary">Trusted Worldwide</h2>
        <p className="text-[10px] md:text-base text-text-secondary max-w-2xl mx-auto leading-tight">Join thousands of successful traders from across the globe who have transformed their financial future with us.</p>
      </div>

      <div className="relative flex flex-col gap-8">
        {/* Top Row - Scrolls Left */}
        <div className="flex overflow-hidden whitespace-nowrap group">
          <motion.div
            className="flex"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ ease: 'linear', duration: 30, repeat: Infinity }}
          >
            {[...topRow, ...topRow].map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </motion.div>
        </div>

        {/* Bottom Row - Scrolls Right */}
        <div className="flex overflow-hidden whitespace-nowrap group">
          <motion.div
            className="flex"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ ease: 'linear', duration: 30, repeat: Infinity }}
          >
            {[...bottomRow, ...bottomRow].map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </motion.div>
        </div>
        
        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
}
