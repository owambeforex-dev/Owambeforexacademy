import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, CheckCircle2, Clock, Trash2, 
  ChevronRight, ArrowLeft, MessageSquare 
} from 'lucide-react';
import StickyHeader from '../components/StickyHeader';
import { useNotifications } from '../contexts/NotificationContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <StickyHeader title="Notifications" />
      
      <div className="container mx-auto px-4 max-w-2xl pt-20">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> Back
          </button>
          {notifications.length > 0 && (
            <button className="text-brand-primary text-xs font-bold hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-surface rounded-3xl border border-border-base p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted mx-auto mb-4">
                <Bell size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No Notifications</h3>
              <p className="text-sm text-text-secondary">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            notifications.map((notification, i) => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markAsRead(notification.id)}
                className={`bg-surface rounded-2xl border p-4 flex gap-4 cursor-pointer transition-all ${
                  notification.read ? 'border-border-base opacity-70' : 'border-brand-primary/30 shadow-sm shadow-brand-primary/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notification.read ? 'bg-bg-secondary text-text-muted' : 'bg-brand-primary/20 text-brand-primary'
                }`}>
                  <Bell size={18} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                      <Clock size={10} /> {formatDate(notification.timestamp)} • {formatTime(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-text-primary font-medium leading-tight mb-2">
                    {notification.message}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
