import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, MessageCircle, Facebook, Twitter, Instagram, Youtube, 
  ChevronRight, Send, CheckCircle2, Headset, ArrowLeft, Clock
} from 'lucide-react';
import StickyHeader from '../components/StickyHeader';
import { useNotifications } from '../contexts/NotificationContext';

const CONTACT_OPTIONS = [
  { icon: Mail, label: 'Email Support', value: 'owambeforexacademy@gmail.com', href: 'mailto:owambeforexacademy@gmail.com' },
  { icon: Phone, label: 'Phone Number', value: '+234 906 5244 842', href: 'tel:+2349065244842' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+234 906 5244 842', href: 'https://wa.me/2349065244842' },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Youtube, href: '#' },
];

export default function Support() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    category: 'Technical'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save ticket to localStorage for demo purposes
    const tickets = JSON.parse(localStorage.getItem('owambe_tickets') || '[]');
    const newTicket = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('owambe_tickets', JSON.stringify([newTicket, ...tickets]));

    // Trigger notification
    const successMsg = "Your ticket has been submitted successfully. We will get back to you via email within 24–48 hours.";
    addNotification(successMsg);

    // Show success popup
    setShowSuccess(true);

    // Auto-dismiss and redirect after 10 seconds
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/support/tickets');
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24 md:pb-32">
      <StickyHeader title="Support Center" />
      
      <div className="container mx-auto px-4 max-w-5xl pt-24 md:pt-32">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {CONTACT_OPTIONS.map((option, i) => (
            <a 
              key={i}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface p-2.5 md:p-3 rounded-xl border border-border-base flex items-center gap-2.5 hover:border-brand-primary/50 transition-all group h-full"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-bg-primary transition-colors shrink-0">
                <option.icon size={16} className="md:w-4 md:h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] md:text-[9px] text-text-secondary font-medium uppercase tracking-wider mb-0.5 whitespace-nowrap">{option.label}</p>
                <p className="text-[10px] md:text-[11px] text-text-primary font-bold whitespace-nowrap leading-none">{option.value}</p>
              </div>
              <ChevronRight size={12} className="text-text-muted shrink-0 group-hover:text-brand-primary transition-colors" />
            </a>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 md:gap-6 mb-10 md:mb-12">
          {SOCIAL_LINKS.map((social, i) => (
            <a 
              key={i}
              href={social.href}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface border border-border-base flex items-center justify-center text-text-secondary hover:text-brand-primary hover:border-brand-primary/50 transition-all"
            >
              <social.icon size={18} className="md:w-5 md:h-5" />
            </a>
          ))}
        </div>

        {/* Ticket History Link */}
        <Link 
          to="/support/tickets"
          className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-3 md:p-4 flex items-center justify-between mb-6 md:mb-8 group hover:bg-brand-primary/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-primary flex items-center justify-center text-bg-primary shrink-0">
              <Clock size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] md:text-sm font-bold text-text-primary truncate">View Ticket History</p>
              <p className="text-[10px] text-text-secondary truncate">Check status of your previous requests</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-brand-primary shrink-0 md:w-[18px] md:h-[18px]" />
        </Link>

        {/* Ticket Form */}
        <div className="max-w-2xl mx-auto bg-surface rounded-3xl border border-border-base p-6 md:p-10 shadow-xl shadow-brand-primary/5">
          <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Send size={24} className="text-brand-primary" /> Submit a Ticket
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">Full Name</label>
              <input 
                required
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-bg-secondary border border-border-base rounded-xl px-4 py-3 text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">Email Address</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-bg-secondary border border-border-base rounded-xl px-4 py-3 text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-bg-secondary border border-border-base rounded-xl px-4 py-3 text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all appearance-none"
              >
                <option value="Complaint">Complaint</option>
                <option value="Payment">Payment</option>
                <option value="Technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">Subject</label>
              <input 
                required
                type="text"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-bg-secondary border border-border-base rounded-xl px-4 py-3 text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">Message</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-bg-secondary border border-border-base rounded-xl px-4 py-3 text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-primary text-bg-primary font-bold py-4 rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 mt-4"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-bg-primary/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface border border-border-base rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Ticket Submitted!</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Your ticket has been submitted successfully. We will get back to you via email within 24–48 hours.
              </p>
              <div className="w-full bg-bg-secondary h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  className="h-full bg-brand-primary"
                />
              </div>
              <p className="text-[10px] text-text-muted mt-4">Redirecting to history in 10s...</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
