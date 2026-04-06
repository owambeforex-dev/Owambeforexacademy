import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Clock, History, Wallet, Star, StarOff, TrendingUp, TrendingDown, X, Search, Activity, Target, Users, MessageSquare, Heart, Copy, LayoutDashboard, LineChart, BrainCircuit, Brain, HelpCircle, Briefcase, User, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Asset = { name: string; symbol: string };
type TradeType = 'Buy' | 'Sell';
type OrderType = 'Market' | 'Limit' | 'Stop';

interface TradeRecord {
  id: string;
  type: TradeType;
  orderType: OrderType;
  asset: Asset;
  lotSize: number;
  entryPrice: number;
  targetPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  profit: number;
  margin: number;
  time: string;
  closeTime?: string;
  status: 'Open' | 'Closed' | 'Pending';
}

interface SocialTrade {
  id: string;
  trader: string;
  action: 'opened' | 'closed';
  type: 'BUY' | 'SELL';
  asset: string;
  lotSize?: number;
  entry?: number;
  profit?: number;
  time: string;
  likes: number;
  comments: TradeComment[];
}

interface TradeComment {
  id: string;
  user: string;
  text: string;
  likes: number;
}

interface TraderProfile {
  id: string;
  username: string;
  winRate: number;
  followers: number;
  totalProfit: number;
  totalTrades: number;
  riskScore: number;
  roi: number;
  isFollowing: boolean;
  isCopying: boolean;
}

const getSymbolForInput = (input: string) => {
  const upperInput = input.toUpperCase().trim();
  const map: Record<string, string> = {
    'BTC': 'BINANCE:BTCUSDT',
    'ETH': 'BINANCE:ETHUSDT',
    'EURUSD': 'FX:EURUSD',
    'GOLD': 'OANDA:XAUUSD',
    'XAUUSD': 'OANDA:XAUUSD',
    'SPX': 'FOREXCOM:SPXUSD',
    'NASDAQ': 'NASDAQ:NDX',
    'NDX': 'NASDAQ:NDX',
    'US30': 'CAPITALCOM:US30',
    'DOW': 'CAPITALCOM:US30',
    'AAPL': 'NASDAQ:AAPL',
    'TSLA': 'NASDAQ:TSLA',
  };
  
  if (map[upperInput]) return map[upperInput];
  
  if (upperInput.includes('USD') && !upperInput.includes(':')) {
    if (['EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'CHF', 'JPY'].some(f => upperInput.includes(f))) {
      return `FX:${upperInput}`;
    }
    return `BINANCE:${upperInput}`; 
  }
  
  if (upperInput.includes(':')) return upperInput;
  
  return `BINANCE:${upperInput}USDT`;
};

export default function Trade() {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset>(() => {
    const saved = localStorage.getItem('lastSelectedAsset');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { name: 'BTC/USD', symbol: 'BINANCE:BTCUSDT' };
  });

  useEffect(() => {
    localStorage.setItem('lastSelectedAsset', JSON.stringify(selectedAsset));
  }, [selectedAsset]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      const symbol = getSymbolForInput(searchQuery);
      setSelectedAsset({ name: searchQuery.toUpperCase(), symbol });
      setSearchQuery('');
    }
  };
  
  const [balance, setBalance] = useState(10000);
  const [equity, setEquity] = useState(10000);
  const [marginUsed, setMarginUsed] = useState(0);
  
  const [orderType, setOrderType] = useState<OrderType>('Market');
  const [lotSize, setLotSize] = useState(0.1);
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [riskPercent, setRiskPercent] = useState('');
  
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  
  const [activeTab, setActiveTab] = useState<'open' | 'pending' | 'closed' | 'analytics' | 'social' | 'leaderboard'>('open');

  // Social Trading State
  const [socialFeed, setSocialFeed] = useState<SocialTrade[]>([
    {
      id: '1',
      trader: 'JoshuaFX',
      action: 'opened',
      type: 'BUY',
      asset: 'EURUSD',
      lotSize: 0.50,
      entry: 1.0850,
      time: '2 mins ago',
      likes: 12,
      comments: [
        { id: 'c1', user: 'JoshuaFX', text: 'EURUSD breakout above resistance. Target 1.0920.', likes: 5 }
      ]
    },
    {
      id: '2',
      trader: 'TraderAlpha',
      action: 'closed',
      type: 'SELL',
      asset: 'BTCUSD',
      profit: 420,
      time: '5 mins ago',
      likes: 34,
      comments: []
    },
    {
      id: '3',
      trader: 'CryptoKing',
      action: 'opened',
      type: 'BUY',
      asset: 'GOLD',
      lotSize: 1.20,
      entry: 2045.50,
      time: '12 mins ago',
      likes: 8,
      comments: []
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<TraderProfile[]>([
    { id: 't1', username: 'JoshuaFX', winRate: 78, followers: 2340, totalProfit: 54200, totalTrades: 1240, riskScore: 85, roi: 324, isFollowing: false, isCopying: false },
    { id: 't2', username: 'TraderAlpha', winRate: 72, followers: 1850, totalProfit: 41100, totalTrades: 980, riskScore: 78, roi: 218, isFollowing: false, isCopying: false },
    { id: 't3', username: 'FX Master', winRate: 68, followers: 1200, totalProfit: 28500, totalTrades: 850, riskScore: 72, roi: 176, isFollowing: false, isCopying: false },
    { id: 't4', username: 'CryptoKing', winRate: 65, followers: 950, totalProfit: 22000, totalTrades: 620, riskScore: 65, roi: 145, isFollowing: false, isCopying: false },
  ]);

  const [selectedTrader, setSelectedTrader] = useState<TraderProfile | null>(null);

  // Simulate live price for current asset (for demo purposes)
  const [currentPrice, setCurrentPrice] = useState(1.1050);

  useEffect(() => {
    // Simulate price changes
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.0010;
        return Number((prev + change).toFixed(4));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  // Simulate open trades PnL updates and pending orders
  useEffect(() => {
    const interval = setInterval(() => {
      setTrades(prev => prev.map(trade => {
        if (trade.status === 'Open') {
          // Randomly fluctuate profit for demo
          const pnlChange = (Math.random() - 0.5) * 20 * trade.lotSize;
          return { ...trade, profit: trade.profit + pnlChange };
        }
        if (trade.status === 'Pending') {
          // Simulate pending order execution
          const isExecuted = Math.random() > 0.8;
          if (isExecuted) {
            return { ...trade, status: 'Open', entryPrice: trade.targetPrice || currentPrice, time: new Date().toLocaleString() };
          }
        }
        return trade;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  // Update Equity and Margin
  useEffect(() => {
    const openTrades = trades.filter(t => t.status === 'Open');
    const totalProfit = openTrades.reduce((sum, t) => sum + t.profit, 0);
    const totalMargin = openTrades.reduce((sum, t) => sum + t.margin, 0);
    setEquity(balance + totalProfit);
    setMarginUsed(totalMargin);
  }, [balance, trades]);

  // Handle Risk % calculation
  useEffect(() => {
    if (riskPercent && stopLoss) {
      const riskAmount = equity * (Number(riskPercent) / 100);
      const slDistance = Math.abs(currentPrice - Number(stopLoss));
      if (slDistance > 0) {
        // Simplified pip value calculation
        const calculatedLot = riskAmount / (slDistance * 100000);
        if (calculatedLot > 0 && isFinite(calculatedLot)) {
          setLotSize(Number(calculatedLot.toFixed(2)));
        }
      }
    }
  }, [riskPercent, stopLoss, equity, currentPrice]);

  // Simulate live feed updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newTrade: SocialTrade = {
        id: Math.random().toString(36).substr(2, 9),
        trader: leaderboard[Math.floor(Math.random() * leaderboard.length)].username,
        action: Math.random() > 0.5 ? 'opened' : 'closed',
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        asset: ['EURUSD', 'BTCUSD', 'GOLD', 'US30', 'AAPL'][Math.floor(Math.random() * 5)],
        lotSize: Number((Math.random() * 2).toFixed(2)),
        entry: Number((Math.random() * 1000).toFixed(2)),
        profit: Math.random() > 0.5 ? Number((Math.random() * 1000).toFixed(2)) : undefined,
        time: 'Just now',
        likes: 0,
        comments: []
      };
      setSocialFeed(prev => [newTrade, ...prev].slice(0, 20));
    }, 15000);
    return () => clearInterval(interval);
  }, [leaderboard]);

  const toggleFollow = (traderId: string) => {
    setLeaderboard(prev => prev.map(t => t.id === traderId ? { ...t, isFollowing: !t.isFollowing, followers: t.isFollowing ? t.followers - 1 : t.followers + 1 } : t));
    if (selectedTrader && selectedTrader.id === traderId) {
      setSelectedTrader(prev => prev ? { ...prev, isFollowing: !prev.isFollowing, followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1 } : null);
    }
  };

  const toggleCopy = (traderId: string) => {
    setLeaderboard(prev => prev.map(t => t.id === traderId ? { ...t, isCopying: !t.isCopying } : t));
    if (selectedTrader && selectedTrader.id === traderId) {
      setSelectedTrader(prev => prev ? { ...prev, isCopying: !prev.isCopying } : null);
    }
    const trader = leaderboard.find(t => t.id === traderId);
    if (trader && !trader.isCopying) {
      alert(`You are now copying trades from ${trader.username}. Trades will be scaled to your account size.`);
    } else if (trader) {
      alert(`You have stopped copying trades from ${trader.username}.`);
    }
  };

  const likeComment = (tradeId: string, commentId?: string) => {
    setSocialFeed(prev => prev.map(t => {
      if (t.id === tradeId) {
        if (commentId) {
          return { ...t, comments: t.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c) };
        }
        return { ...t, likes: t.likes + 1 };
      }
      return t;
    }));
  };

  const addComment = (tradeId: string, text: string) => {
    setSocialFeed(prev => prev.map(t => {
      if (t.id === tradeId) {
        return { ...t, comments: [...t.comments, { id: Math.random().toString(), user: 'You', text, likes: 0 }] };
      }
      return t;
    }));
  };

  const handleTrade = (type: TradeType) => {
    const marginRequired = lotSize * 1000; // Simplified margin calculation
    if (orderType === 'Market' && marginUsed + marginRequired > equity) {
      alert("Insufficient margin!");
      return;
    }
    
    const newTrade: TradeRecord = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      orderType,
      asset: selectedAsset,
      lotSize,
      entryPrice: orderType === 'Market' ? currentPrice : 0,
      targetPrice: orderType !== 'Market' && targetPrice ? Number(targetPrice) : undefined,
      stopLoss: stopLoss ? Number(stopLoss) : undefined,
      takeProfit: takeProfit ? Number(takeProfit) : undefined,
      profit: orderType === 'Market' ? - (lotSize * 5) : 0, // Spread simulation
      margin: marginRequired,
      time: new Date().toLocaleString(),
      status: orderType === 'Market' ? 'Open' : 'Pending'
    };
    
    setTrades(prev => [newTrade, ...prev]);
    setStopLoss('');
    setTakeProfit('');
    setTargetPrice('');
  };

  const closeTrade = (tradeId: string) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade || trade.status !== 'Open') return;

    setTrades(prev => prev.map(t => 
      t.id === tradeId 
        ? { ...t, status: 'Closed', exitPrice: currentPrice, closeTime: new Date().toLocaleString() } 
        : t
    ));
    
    setBalance(prev => prev + trade.profit);
  };

  const cancelOrder = (tradeId: string) => {
    setTrades(prev => prev.filter(t => t.id !== tradeId));
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-bg-primary flex">
      <div className="flex-1 px-4 h-full flex flex-col xl:flex-row gap-6 overflow-hidden w-full max-w-[1600px] mx-auto">
        
        {/* Left/Center Column: Markets & Chart */}
        <div className="flex-1 flex flex-col gap-6 w-full xl:w-[75%]">
          
          {/* Asset Search */}
          <form onSubmit={handleSearchSubmit} className="glass rounded-xl p-2 border border-border-base flex items-center gap-2">
            <Search className="text-text-secondary ml-2" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search any symbol (e.g. BTC, EURUSD, AAPL, SPX)..."
              className="bg-transparent border-none text-text-primary font-mono focus:outline-none flex-1 py-2 px-2"
            />
            <button type="submit" className="bg-brand-primary text-brand-dark px-6 py-2 rounded-lg font-bold text-sm hover:bg-brand-primary/90 transition-colors">
              Load Chart
            </button>
          </form>

          {/* TradingView Chart */}
          <div className="glass rounded-xl border border-border-base overflow-hidden h-[500px] lg:h-[600px] relative">
            <AdvancedRealTimeChart
              symbol={selectedAsset.symbol}
              theme="dark"
              autosize
              allow_symbol_change={true}
              hide_side_toolbar={false}
              hide_top_toolbar={false}
              toolbar_bg="#0b0b0b"
              backgroundColor="#0b0b0b"
              studies={[
                "MASimple@tv-basicstudies",
                "BollingerBands@tv-basicstudies",
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies",
                "Volume@tv-basicstudies"
              ]}
            />
          </div>

          {/* Trade Management Panel */}
          <div className="glass rounded-xl border border-border-base overflow-hidden flex flex-col min-h-[300px]">
            <div className="flex border-b border-border-base overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveTab('open')}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'open' ? 'bg-brand-primary/10 text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Open Trades ({trades.filter(t => t.status === 'Open').length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'pending' ? 'bg-brand-primary/10 text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Pending ({trades.filter(t => t.status === 'Pending').length})
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'closed' ? 'bg-brand-primary/10 text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'analytics' ? 'bg-brand-primary/10 text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'social' ? 'bg-brand-primary/10 text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Social Feed
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === 'leaderboard' ? 'bg-brand-primary/10 text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                Leaderboard
              </button>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-base text-xs uppercase tracking-wider text-text-muted bg-bg-secondary">
                    <th className="p-3 font-medium whitespace-nowrap">Asset</th>
                    <th className="p-3 font-medium whitespace-nowrap">Type</th>
                    <th className="p-3 font-medium whitespace-nowrap">Size</th>
                    <th className="p-3 font-medium whitespace-nowrap">Entry</th>
                    {activeTab === 'closed' && <th className="p-3 font-medium whitespace-nowrap">Exit</th>}
                    <th className="p-3 font-medium whitespace-nowrap">SL / TP</th>
                    <th className="p-3 font-medium whitespace-nowrap">Time</th>
                    <th className="p-3 font-medium text-right whitespace-nowrap">Profit</th>
                    {activeTab === 'open' && <th className="p-3 font-medium text-right whitespace-nowrap">Action</th>}
                  </tr>
                </thead>
                <tbody className="text-sm font-mono">
                  {activeTab === 'open' ? (
                    trades.filter(t => t.status === 'Open').length === 0 ? (
                      <tr><td colSpan={8} className="p-8 text-center text-text-muted font-sans">No open trades</td></tr>
                    ) : (
                      trades.filter(t => t.status === 'Open').map(trade => (
                        <tr key={trade.id} className="border-b border-border-base hover:bg-surface-hover transition-colors">
                          <td className="p-3 text-text-primary font-bold whitespace-nowrap">{trade.asset.name}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${trade.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="p-3 text-text-secondary whitespace-nowrap">{trade.lotSize}</td>
                          <td className="p-3 text-text-secondary whitespace-nowrap">{trade.entryPrice.toFixed(4)}</td>
                          <td className="p-3 text-text-muted text-xs whitespace-nowrap">
                            {trade.stopLoss || '-'} / {trade.takeProfit || '-'}
                          </td>
                          <td className="p-3 text-text-muted text-xs whitespace-nowrap">{trade.time}</td>
                          <td className={`p-3 text-right font-bold whitespace-nowrap ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${trade.profit.toFixed(2)}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button onClick={() => closeTrade(trade.id)} className="p-1.5 bg-surface-hover hover:bg-red-500/20 hover:text-red-400 rounded transition-colors">
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : activeTab === 'pending' ? (
                    trades.filter(t => t.status === 'Pending').length === 0 ? (
                      <tr><td colSpan={8} className="p-8 text-center text-text-muted font-sans">No pending orders</td></tr>
                    ) : (
                      trades.filter(t => t.status === 'Pending').map(trade => (
                        <tr key={trade.id} className="border-b border-border-base hover:bg-surface-hover transition-colors">
                          <td className="p-3 text-text-primary font-bold whitespace-nowrap">{trade.asset.name}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${trade.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {trade.orderType} {trade.type}
                            </span>
                          </td>
                          <td className="p-3 text-text-secondary whitespace-nowrap">{trade.lotSize}</td>
                          <td className="p-3 text-text-secondary whitespace-nowrap">{trade.targetPrice?.toFixed(4)}</td>
                          <td className="p-3 text-text-muted text-xs whitespace-nowrap">
                            {trade.stopLoss || '-'} / {trade.takeProfit || '-'}
                          </td>
                          <td className="p-3 text-text-muted text-xs whitespace-nowrap">{trade.time}</td>
                          <td className="p-3 text-right text-text-muted whitespace-nowrap">-</td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button onClick={() => cancelOrder(trade.id)} className="p-1.5 bg-surface-hover hover:bg-red-500/20 hover:text-red-400 rounded transition-colors">
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : activeTab === 'closed' ? (
                    trades.filter(t => t.status === 'Closed').length === 0 ? (
                      <tr><td colSpan={8} className="p-8 text-center text-text-muted font-sans">No trade history</td></tr>
                    ) : (
                      trades.filter(t => t.status === 'Closed').map(trade => (
                        <tr key={trade.id} className="border-b border-border-base hover:bg-surface-hover transition-colors">
                          <td className="p-3 text-text-primary font-bold whitespace-nowrap">{trade.asset.name}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${trade.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="p-3 text-text-secondary whitespace-nowrap">{trade.lotSize}</td>
                          <td className="p-3 text-text-secondary whitespace-nowrap">{trade.entryPrice.toFixed(4)}</td>
                          <td className="p-3 text-text-secondary whitespace-nowrap">{trade.exitPrice?.toFixed(4)}</td>
                          <td className="p-3 text-text-muted text-xs whitespace-nowrap">
                            {trade.stopLoss || '-'} / {trade.takeProfit || '-'}
                          </td>
                          <td className="p-3 text-text-muted text-xs whitespace-nowrap">{trade.closeTime}</td>
                          <td className={`p-3 text-right font-bold whitespace-nowrap ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${trade.profit.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )
                  ) : activeTab === 'social' ? (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-4 space-y-4">
                          {socialFeed.map(feed => (
                            <div key={feed.id} className="bg-bg-secondary rounded-xl p-4 border border-border-base">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold cursor-pointer" onClick={() => setSelectedTrader(leaderboard.find(t => t.username === feed.trader) || null)}>
                                    {feed.trader.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-text-primary cursor-pointer hover:text-brand-primary transition-colors" onClick={() => setSelectedTrader(leaderboard.find(t => t.username === feed.trader) || null)}>{feed.trader}</span>
                                      <span className="text-text-secondary text-sm">{feed.action} {feed.type}</span>
                                      <span className="font-bold text-text-primary">{feed.asset}</span>
                                    </div>
                                    <div className="text-xs text-text-muted">{feed.time}</div>
                                  </div>
                                </div>
                                <button onClick={() => toggleCopy(leaderboard.find(t => t.username === feed.trader)?.id || '')} className="px-3 py-1.5 bg-surface-hover hover:bg-brand-primary/10 rounded-lg text-xs font-bold text-text-secondary flex items-center gap-1 transition-colors">
                                  <Copy size={12} /> Copy
                                </button>
                              </div>
                              
                              <div className="bg-bg-primary/50 rounded-lg p-3 mb-3 flex gap-4 text-sm font-mono">
                                {feed.lotSize && <div><span className="text-text-muted">Lot:</span> <span className="text-text-secondary">{feed.lotSize}</span></div>}
                                {feed.entry && <div><span className="text-text-muted">Entry:</span> <span className="text-text-secondary">{feed.entry}</span></div>}
                                {feed.profit !== undefined && <div><span className="text-text-muted">Profit:</span> <span className={feed.profit >= 0 ? 'text-green-400' : 'text-red-400'}>{feed.profit >= 0 ? '+' : ''}${feed.profit}</span></div>}
                              </div>

                              {feed.comments.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  {feed.comments.map(comment => (
                                    <div key={comment.id} className="bg-bg-primary/30 rounded-lg p-2 text-sm">
                                      <span className="font-bold text-brand-primary mr-2">{comment.user}:</span>
                                      <span className="text-text-secondary">{comment.text}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-sm text-text-secondary">
                                <button onClick={() => likeComment(feed.id)} className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                                  <Heart size={14} /> {feed.likes}
                                </button>
                                <button onClick={() => {
                                  const text = prompt('Add a comment:');
                                  if (text) addComment(feed.id, text);
                                }} className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                                  <MessageSquare size={14} /> Comment
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : activeTab === 'leaderboard' ? (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-border-base text-xs uppercase tracking-wider text-text-muted bg-bg-secondary">
                                <th className="p-4 font-medium whitespace-nowrap">Rank</th>
                                <th className="p-4 font-medium whitespace-nowrap">Trader</th>
                                <th className="p-4 font-medium whitespace-nowrap">ROI</th>
                                <th className="p-4 font-medium whitespace-nowrap">Win Rate</th>
                                <th className="p-4 font-medium whitespace-nowrap">Rating</th>
                                <th className="p-4 font-medium text-right whitespace-nowrap">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {leaderboard.sort((a, b) => b.roi - a.roi).map((trader, index) => (
                                <tr key={trader.id} className="border-b border-border-base hover:bg-surface-hover transition-colors">
                                  <td className="p-4 text-text-primary font-bold whitespace-nowrap">{index + 1}</td>
                                  <td className="p-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedTrader(trader)}>
                                      <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
                                        {trader.username.charAt(0)}
                                      </div>
                                      <span className="font-bold text-text-primary hover:text-brand-primary transition-colors">{trader.username}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-green-400 font-mono font-bold whitespace-nowrap">+{trader.roi}%</td>
                                  <td className="p-4 text-text-secondary font-mono whitespace-nowrap">{trader.winRate}%</td>
                                  <td className="p-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1 text-brand-primary font-mono">
                                      <Star size={12} className="fill-brand-primary" /> {trader.riskScore}
                                    </div>
                                  </td>
                                  <td className="p-4 text-right whitespace-nowrap">
                                    <button 
                                      onClick={() => toggleCopy(trader.id)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${trader.isCopying ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-brand-primary text-brand-dark'}`}
                                    >
                                      {trader.isCopying ? 'Copying' : 'Copy'}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-bg-secondary p-4 rounded-lg">
                            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Trades</div>
                            <div className="text-xl font-mono text-text-primary">{trades.filter(t => t.status === 'Closed').length}</div>
                          </div>
                          <div className="bg-bg-secondary p-4 rounded-lg">
                            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Win Rate</div>
                            <div className="text-xl font-mono text-brand-primary">
                              {trades.filter(t => t.status === 'Closed').length > 0 
                                ? ((trades.filter(t => t.status === 'Closed' && t.profit > 0).length / trades.filter(t => t.status === 'Closed').length) * 100).toFixed(1) + '%' 
                                : '0.0%'}
                            </div>
                          </div>
                          <div className="bg-bg-secondary p-4 rounded-lg">
                            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Total PnL</div>
                            <div className={`text-xl font-mono ${trades.filter(t => t.status === 'Closed').reduce((sum, t) => sum + t.profit, 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ${trades.filter(t => t.status === 'Closed').reduce((sum, t) => sum + t.profit, 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-bg-secondary p-4 rounded-lg">
                            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Best Trade</div>
                            <div className="text-xl font-mono text-green-400">
                              ${trades.filter(t => t.status === 'Closed').reduce((max, t) => Math.max(max, t.profit), 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Order Panel & Account Info */}
        <div className="w-full xl:w-80 flex flex-col gap-6">
          
          {/* Account Overview */}
          <div className="glass rounded-xl p-6 border border-brand-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 text-text-secondary mb-4">
              <Wallet size={18} className="text-brand-primary" />
              <span className="font-medium uppercase tracking-wider text-xs">Demo Account</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Equity</div>
                <div className="text-3xl font-mono font-bold text-text-primary">
                  ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-base">
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Balance</div>
                  <div className="font-mono text-sm text-text-secondary">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Margin Used</div>
                  <div className="font-mono text-sm text-text-secondary">
                    ${marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Free Margin</div>
                  <div className="font-mono text-sm text-brand-primary">
                    ${(equity - marginUsed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Margin Level</div>
                  <div className="font-mono text-sm text-text-secondary">
                    {marginUsed > 0 ? ((equity / marginUsed) * 100).toFixed(2) + '%' : '∞'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Panel */}
          <div className="glass rounded-xl p-6 border border-border-base flex-1 flex flex-col">
            <h3 className="dashboard-title mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-brand-primary" />
                New Order
              </span>
              <span className="text-xs font-mono text-text-muted bg-bg-secondary px-2 py-1 rounded">
                {selectedAsset.name}
              </span>
            </h3>
            
            <div className="flex gap-2 mb-6">
              {(['Market', 'Limit', 'Stop'] as OrderType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                    orderType === type ? 'bg-brand-primary text-brand-dark' : 'bg-bg-secondary text-text-secondary hover:bg-surface-hover'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-5 flex-1">
              {orderType !== 'Market' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">Target Price</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Price"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full bg-bg-secondary border border-border-base rounded-lg py-2.5 px-4 text-text-primary font-mono focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 flex justify-between">
                  <span>Lot Size (Volume)</span>
                  <span className="text-brand-primary">Risk: {riskPercent ? `${riskPercent}%` : 'Manual'}</span>
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setLotSize(Math.max(0.01, lotSize - 0.01))} className="w-10 h-10 rounded-lg bg-bg-secondary hover:bg-surface-hover flex items-center justify-center font-mono text-xl">-</button>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={lotSize}
                    onChange={(e) => setLotSize(Number(e.target.value))}
                    className="flex-1 bg-bg-secondary border border-border-base rounded-lg py-2 px-4 text-center text-text-primary font-mono focus:outline-none focus:border-brand-primary transition-colors"
                  />
                  <button onClick={() => setLotSize(lotSize + 0.01)} className="w-10 h-10 rounded-lg bg-bg-secondary hover:bg-surface-hover flex items-center justify-center font-mono text-xl">+</button>
                </div>
                <div className="text-right mt-1 text-xs text-text-muted font-mono">
                  Req. Margin: ${(lotSize * 1000).toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">Stop Loss</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Price"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-bg-secondary border border-border-base rounded-lg py-2.5 px-4 text-text-primary font-mono focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">Take Profit</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Price"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full bg-bg-secondary border border-border-base rounded-lg py-2.5 px-4 text-text-primary font-mono focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">Risk % (Auto Lot Size)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  className="w-full bg-bg-secondary border border-border-base rounded-lg py-2.5 px-4 text-text-primary font-mono focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => handleTrade('Sell')}
                className="w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                <span className="text-xs uppercase tracking-wider opacity-80">Sell {orderType !== 'Market' && orderType}</span>
                <span className="font-mono text-lg">{orderType === 'Market' ? currentPrice.toFixed(4) : targetPrice || '---'}</span>
              </button>
              <button
                onClick={() => handleTrade('Buy')}
                className="w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors"
              >
                <span className="text-xs uppercase tracking-wider opacity-80">Buy {orderType !== 'Market' && orderType}</span>
                <span className="font-mono text-lg">{orderType === 'Market' ? (currentPrice + 0.0002).toFixed(4) : targetPrice || '---'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Trader Profile Modal */}
      {selectedTrader && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl border border-border-base p-6 max-w-md w-full relative">
            <button onClick={() => setSelectedTrader(null)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary text-2xl font-bold">
                {selectedTrader.username.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{selectedTrader.username}</h2>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Users size={14} /> {selectedTrader.followers.toLocaleString()} Followers</span>
                  <span className="flex items-center gap-1 text-brand-primary"><Star size={14} className="fill-brand-primary" /> {selectedTrader.riskScore}/100 Rating</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-bg-secondary p-3 rounded-lg">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Win Rate</div>
                <div className="text-lg font-mono text-green-400">{selectedTrader.winRate}%</div>
              </div>
              <div className="bg-bg-secondary p-3 rounded-lg">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Profit</div>
                <div className="text-lg font-mono text-brand-primary">${selectedTrader.totalProfit.toLocaleString()}</div>
              </div>
              <div className="bg-bg-secondary p-3 rounded-lg">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Trades</div>
                <div className="text-lg font-mono text-text-primary">{selectedTrader.totalTrades}</div>
              </div>
              <div className="bg-bg-secondary p-3 rounded-lg">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Monthly ROI</div>
                <div className="text-lg font-mono text-green-400">+{selectedTrader.roi}%</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => toggleFollow(selectedTrader.id)}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${selectedTrader.isFollowing ? 'bg-surface text-text-primary' : 'bg-brand-primary text-brand-dark'}`}
              >
                {selectedTrader.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <button 
                onClick={() => toggleCopy(selectedTrader.id)}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${selectedTrader.isCopying ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-surface text-text-primary border border-border-base hover:bg-surface-hover'}`}
              >
                <Copy size={16} /> {selectedTrader.isCopying ? 'Copying' : 'Copy Trades'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

