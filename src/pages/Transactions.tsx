import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StickyHeader from '../components/StickyHeader';

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('owambe_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        setTransactions([]);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <StickyHeader title="All Transactions" />
      
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

        <div className="card-base overflow-hidden">
          {transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== transactions.length - 1 ? 'border-b border-border-base' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'Deposit' ? 'bg-success/10 text-success' : 
                    tx.type === 'Subscription' ? 'bg-error/10 text-error' : 'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    {tx.type === 'Deposit' ? <ArrowDownLeft size={16} /> : 
                     tx.type === 'Subscription' ? <ArrowUpRight size={16} /> : <Clock size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">{tx.type} - {tx.serviceName || ''}</p>
                    <p className="text-[10px] text-text-muted">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${tx.amount.startsWith('+') ? 'text-success' : 'text-error'}`}>{tx.amount}</p>
                  <p className="text-[10px] text-text-muted">{tx.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Clock size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text-primary mb-2">No Transactions</h3>
              <p className="text-sm text-text-secondary">
                You haven't made any transactions yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
