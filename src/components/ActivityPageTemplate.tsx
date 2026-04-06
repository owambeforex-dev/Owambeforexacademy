import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Clock, CheckCircle2, AlertCircle, 
  ChevronRight, MessageSquare, Calendar, Tag,
  Coins, GraduationCap, Zap, Award, Briefcase
} from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'Pending' | 'Resolved';
  message: string;
  createdAt: string;
  serviceType?: string;
  plan?: string;
  amount?: number;
  expiryDate?: string;
}

interface ActivityPageProps {
  title: string;
  serviceType: string;
  emptyMessage: string;
  icon: any;
  header?: React.ReactNode;
}

export default function ActivityPageTemplate({ title, serviceType, emptyMessage, icon: Icon, header }: ActivityPageProps) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('owambe_tickets');
    if (saved) {
      try {
        const allTickets = JSON.parse(saved);
        // Filter tickets by serviceType or by subject/message content if serviceType is missing
        const filtered = allTickets.filter((t: Ticket) => 
          t.serviceType === serviceType || 
          t.subject.toLowerCase().includes(serviceType.toLowerCase()) ||
          t.message.toLowerCase().includes(serviceType.toLowerCase())
        );
        setTickets(filtered);
      } catch (e) {
        setTickets([]);
      }
    }
  }, [serviceType]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <StickyHeader title={title} />
      
      <div className="container mx-auto px-4 max-w-2xl pt-20">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/assets')}
            className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> Back to Overview
          </button>
        </div>

        {/* Custom Header */}
        {header}

        {/* Activity List */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-surface rounded-3xl border border-border-base p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted mx-auto mb-4">
                <Icon size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No Activities Found</h3>
              <p className="text-sm text-text-secondary mb-6">
                {emptyMessage}
              </p>
              <Link 
                to="/services"
                className="inline-block bg-brand-primary text-bg-primary px-8 py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
              >
                Explore Services
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
                  </div>
                </div>

                <div className="bg-bg-secondary/50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-text-secondary leading-relaxed italic mb-2">
                    "{ticket.message}"
                  </p>
                  {ticket.plan && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-border-base/30">
                      <div>
                        <p className="text-[8px] text-text-muted uppercase font-bold">Plan</p>
                        <p className="text-[10px] font-bold text-text-primary">{ticket.plan}</p>
                      </div>
                      {ticket.amount && (
                        <div>
                          <p className="text-[8px] text-text-muted uppercase font-bold">Amount</p>
                          <p className="text-[10px] font-bold text-text-primary">${ticket.amount}</p>
                        </div>
                      )}
                      {ticket.expiryDate && (
                        <div>
                          <p className="text-[8px] text-text-muted uppercase font-bold">Expiry</p>
                          <p className="text-[10px] font-bold text-error">{formatDate(ticket.expiryDate)}</p>
                        </div>
                      )}
                    </div>
                  )}
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
      </div>
    </div>
  );
}
