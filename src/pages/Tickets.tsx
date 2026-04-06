import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, MessageSquare, Calendar, Tag
} from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

interface Ticket {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: 'Pending' | 'Resolved';
  createdAt: string;
}

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('owambe_tickets');
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch (e) {
        setTickets([]);
      }
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24 md:pb-32">
      <StickyHeader title="Ticket History" />
      
      <div className="container mx-auto px-4 max-w-2xl pt-24 md:pt-32">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/support')}
            className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> Back to Support
          </button>
          <Link 
            to="/support"
            className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-primary/20 transition-all"
          >
            + New Ticket
          </Link>
        </div>

        {/* Ticket List */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-surface rounded-3xl border border-border-base p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted mx-auto mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No Tickets Found</h3>
              <p className="text-sm text-text-secondary mb-6">
                You haven't submitted any support tickets yet.
              </p>
              <Link 
                to="/support"
                className="inline-block bg-brand-primary text-bg-primary px-8 py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
              >
                Submit a Ticket
              </Link>
            </div>
          ) : (
            tickets.map((ticket, i) => (
              <motion.div 
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface rounded-2xl border border-border-base p-5 shadow-sm hover:border-brand-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        ticket.status === 'Pending' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                        <Tag size={10} /> {ticket.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                      {ticket.subject}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-text-muted flex items-center justify-end gap-1 mb-0.5">
                      <Calendar size={10} /> {formatDate(ticket.createdAt)}
                    </p>
                    <p className="text-[10px] text-text-muted flex items-center justify-end gap-1">
                      <Clock size={10} /> {formatTime(ticket.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="bg-bg-secondary/50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed italic">
                    "{ticket.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-base/50">
                  <span className="text-[10px] text-text-muted font-mono">ID: #{ticket.id.toUpperCase()}</span>
                  <button className="text-brand-primary text-[10px] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    View Details <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Support Banner */}
        <div className="mt-12 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 rounded-3xl p-6 border border-brand-primary/20 text-center">
          <h4 className="text-base font-bold text-text-primary mb-2">Still need help?</h4>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Our support team is available 24/7 to assist you with any issues.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:owambeforexacademy@gmail.com" className="text-brand-primary text-xs font-bold hover:underline">Email Us</a>
            <span className="w-1 h-1 rounded-full bg-text-muted"></span>
            <a href="https://wa.me/2349065244842" className="text-brand-primary text-xs font-bold hover:underline">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
