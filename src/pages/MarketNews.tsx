import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Filter, Search, ChevronDown, ChevronUp, BarChart2, Clock, Newspaper } from 'lucide-react';
import StickyHeader from '../components/StickyHeader';

// --- TYPES ---
type Impact = 'High' | 'Medium' | 'Low' | 'Holiday';
type Status = 'past' | 'current' | 'upcoming';
type Category = 'Forex' | 'Crypto' | 'Metals' | 'Energy';

interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  currency: string;
  flag: string;
  impact: Impact;
  event: string;
  actual: string;
  forecast: string;
  previous: string;
  status: Status;
  description: string;
  category: Category;
}

// --- MOCK DATA ---
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    date: 'Today',
    time: '04:30',
    currency: 'GBP',
    flag: '🇬🇧',
    impact: 'Medium',
    event: 'Construction PMI',
    actual: '50.2',
    forecast: '49.8',
    previous: '49.7',
    status: 'past',
    description: 'Measures the level of a diffusion index based on surveyed purchasing managers in the construction industry.',
    category: 'Forex'
  },
  {
    id: '2',
    date: 'Today',
    time: '08:30',
    currency: 'USD',
    flag: '🇺🇸',
    impact: 'High',
    event: 'Non-Farm Payrolls',
    actual: '',
    forecast: '200K',
    previous: '180K',
    status: 'current',
    description: 'Measures the change in the number of employed people during the previous month, excluding the farming industry.',
    category: 'Forex'
  },
  {
    id: '3',
    date: 'Today',
    time: '10:00',
    currency: 'CAD',
    flag: '🇨🇦',
    impact: 'High',
    event: 'Ivey PMI',
    actual: '',
    forecast: '54.2',
    previous: '53.9',
    status: 'upcoming',
    description: 'Measures the level of a diffusion index based on surveyed purchasing managers.',
    category: 'Forex'
  },
  {
    id: '4',
    date: 'Tomorrow',
    time: '02:00',
    currency: 'EUR',
    flag: '🇪🇺',
    impact: 'Low',
    event: 'German Factory Orders m/m',
    actual: '',
    forecast: '0.5%',
    previous: '-0.2%',
    status: 'upcoming',
    description: 'Measures the change in the total value of new purchase orders placed with manufacturers.',
    category: 'Forex'
  },
  {
    id: '5',
    date: 'Tomorrow',
    time: 'All Day',
    currency: 'JPY',
    flag: '🇯🇵',
    impact: 'Holiday',
    event: 'Bank Holiday',
    actual: '',
    forecast: '',
    previous: '',
    status: 'upcoming',
    description: 'Japanese banks will be closed in observance of Vernal Equinox Day.',
    category: 'Forex'
  },
  {
    id: '6',
    date: 'Today',
    time: '12:00',
    currency: 'BTC',
    flag: '₿',
    impact: 'High',
    event: 'Bitcoin Halving Block',
    actual: '',
    forecast: '',
    previous: '',
    status: 'upcoming',
    description: 'Estimated time for the next Bitcoin block reward halving.',
    category: 'Crypto'
  },
  {
    id: '7',
    date: 'Today',
    time: '14:30',
    currency: 'XAU',
    flag: '🪙',
    impact: 'High',
    event: 'Gold Reserves Data',
    actual: '',
    forecast: '1.2M',
    previous: '1.1M',
    status: 'upcoming',
    description: 'Central bank gold reserve changes.',
    category: 'Metals'
  },
  {
    id: '8',
    date: 'Tomorrow',
    time: '10:30',
    currency: 'WTI',
    flag: '🛢️',
    impact: 'High',
    event: 'Crude Oil Inventories',
    actual: '',
    forecast: '-1.5M',
    previous: '2.1M',
    status: 'upcoming',
    description: 'Measures the change in the number of barrels of crude oil held in inventory by commercial firms during the past week.',
    category: 'Energy'
  }
];

const MOCK_NEWS = [
  {
    id: '1',
    title: 'US CPI rises above expectations, dampening rate cut hopes',
    source: 'Reuters',
    time: '2h ago',
    summary: 'Inflation data shows stronger than expected growth in the services sector, leading markets to reprice Federal Reserve rate cut expectations for the year.',
  },
  {
    id: '2',
    title: 'ECB holds rates steady, signals potential cuts in June',
    source: 'Bloomberg',
    time: '4h ago',
    summary: 'The European Central Bank kept interest rates unchanged but updated its guidance to suggest that a June rate cut is becoming increasingly likely if inflation trends continue.',
  },
];

const TIME_TABS = ['Yesterday', 'Today', 'Tomorrow', 'This Week', 'Next Week', 'This Month', 'Next Month', 'Last Week', 'Last Month'];
const CATEGORY_TABS: Category[] = ['Forex', 'Crypto', 'Metals', 'Energy'];

export default function MarketNews() {
  const [activeTimeTab, setActiveTimeTab] = useState('This Week');
  const [activeCategory, setActiveCategory] = useState<Category>('Forex');
  const [searchQuery, setSearchQuery] = useState('');
  const [upNextMode, setUpNextMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  
  const [impactFilters, setImpactFilters] = useState({
    High: true,
    Medium: true,
    Low: true,
    Holiday: true
  });

  const toggleImpactFilter = (impact: Impact) => {
    setImpactFilters(prev => ({ ...prev, [impact]: !prev[impact] }));
  };

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      // Category filter
      if (event.category !== activeCategory) return false;
      
      // Impact filter
      if (!impactFilters[event.impact]) return false;
      
      // Up Next mode
      if (upNextMode && event.status === 'past') return false;
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!event.event.toLowerCase().includes(query) && 
            !event.currency.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      return true;
    });
  }, [activeCategory, impactFilters, upNextMode, searchQuery]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach(event => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
    });
    return groups;
  }, [filteredEvents]);

  const nextMajorEvent = useMemo(() => {
    return MOCK_EVENTS.find(e => e.status === 'upcoming' && e.impact === 'High');
  }, []);

  const getImpactIcon = (impact: Impact) => {
    switch (impact) {
      case 'High': return <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" title="High Impact" />;
      case 'Medium': return <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" title="Medium Impact" />;
      case 'Low': return <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" title="Low Impact" />;
      case 'Holiday': return <div className="w-3 h-3 rounded-full bg-gray-500" title="Non-Economic / Holiday" />;
    }
  };

  const getRowStyle = (status: Status) => {
    switch (status) {
      case 'past': return 'opacity-50 hover:opacity-100';
      case 'current': return 'bg-brand-primary/10 border-l-2 border-brand-primary';
      case 'upcoming': return 'hover:bg-white/[0.02]';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedEventId(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12">
      <StickyHeader title="Market News" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="text-brand-primary" size={24} />
            This Week Calendar: Mar 15 - Mar 21
          </h1>
          
          {/* Time Navigation Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2">
            {TIME_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTimeTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTimeTab === tab 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Nav (Calendar Types) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors border ${
                activeCategory === tab 
                  ? 'bg-brand-primary text-black border-brand-primary' 
                  : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {tab} Calendar
            </button>
          ))}
        </div>

        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white/[0.02] p-3 rounded-xl border border-white/5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search Events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setUpNextMode(!upNextMode)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                upNextMode 
                  ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/50' 
                  : 'bg-black/50 text-gray-300 border-white/10 hover:bg-white/5'
              }`}
            >
              <Clock size={16} />
              Up Next
            </button>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                isFilterOpen 
                  ? 'bg-white/10 text-white border-white/20' 
                  : 'bg-black/50 text-gray-300 border-white/10 hover:bg-white/5'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-[#111] border border-white/10 rounded-xl p-4 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={impactFilters.High} 
                    onChange={() => toggleImpactFilter('High')}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${impactFilters.High ? 'bg-red-500 border-red-500' : 'border-white/20 group-hover:border-white/40'}`}>
                    {impactFilters.High && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">High Impact</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={impactFilters.Medium} 
                    onChange={() => toggleImpactFilter('Medium')}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${impactFilters.Medium ? 'bg-orange-500 border-orange-500' : 'border-white/20 group-hover:border-white/40'}`}>
                    {impactFilters.Medium && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Medium Impact</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={impactFilters.Low} 
                    onChange={() => toggleImpactFilter('Low')}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${impactFilters.Low ? 'bg-yellow-500 border-yellow-500' : 'border-white/20 group-hover:border-white/40'}`}>
                    {impactFilters.Low && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Low Impact</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={impactFilters.Holiday} 
                    onChange={() => toggleImpactFilter('Holiday')}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${impactFilters.Holiday ? 'bg-gray-500 border-gray-500' : 'border-white/20 group-hover:border-white/40'}`}>
                    {impactFilters.Holiday && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Holiday / Non-Economic</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Up Next Banner */}
        {upNextMode && nextMajorEvent && (
          <div className="mb-6 bg-brand-primary/10 border border-brand-primary/30 rounded-xl p-4 flex items-center justify-between sticky top-20 z-10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-brand-primary font-bold uppercase tracking-wider mb-1">Next Major Event</p>
                <p className="text-white font-medium">{nextMajorEvent.event} ({nextMajorEvent.currency})</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300 font-mono">{nextMajorEvent.time}</p>
              <p className="text-xs text-gray-500">{nextMajorEvent.date}</p>
            </div>
          </div>
        )}

        {/* Economic Calendar Table */}
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden mb-12 shadow-2xl">
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">No scheduled events</h3>
              <p className="text-gray-400">Try adjusting your filters or selecting a different timeframe.</p>
            </div>
          ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/60 border-b border-white/10 text-[10px] md:text-xs uppercase tracking-wider text-gray-500">
                <th className="p-3 font-medium w-24">Date</th>
                <th className="p-3 font-medium w-20">Time</th>
                <th className="p-3 font-medium w-24">Cur.</th>
                <th className="p-3 font-medium w-16 text-center">Imp.</th>
                <th className="p-3 font-medium">Event</th>
                <th className="p-3 font-medium w-12"></th>
                <th className="p-3 font-medium text-right w-24">Actual</th>
                <th className="p-3 font-medium text-right w-24">Forecast</th>
                <th className="p-3 font-medium text-right w-24">Previous</th>
                <th className="p-3 font-medium text-center w-16">Graph</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(groupedEvents).map(([date, events]: [string, CalendarEvent[]]) => (
                <React.Fragment key={date}>
                  {/* Date Group Header */}
                  <tr className="bg-white/[0.02] border-y border-white/10">
                    <td colSpan={10} className="p-2 px-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                      --- {date} ---
                    </td>
                  </tr>
                  
                  {/* Events for this date */}
                  {events.map((event) => (
                    <React.Fragment key={event.id}>
                      <tr 
                        onClick={() => toggleExpand(event.id)}
                        className={`group cursor-pointer transition-colors border-l-2 ${
                          getRowStyle(event.status)
                        } ${event.status !== 'current' ? 'border-transparent' : ''}`}
                      >
                        <td className="p-3 text-[10px] md:text-sm text-gray-400 font-medium">{event.date}</td>
                        <td className="p-3 text-[10px] md:text-sm text-gray-300 font-mono">{event.time}</td>
                        <td className="p-3 text-[10px] md:text-sm font-medium text-white flex items-center gap-2">
                          <span className="text-base">{event.flag}</span>
                          {event.currency}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center">
                            {getImpactIcon(event.impact)}
                          </div>
                        </td>
                        <td className="p-3 text-[10px] md:text-sm text-gray-200 font-medium group-hover:text-brand-primary transition-colors">
                          {event.event}
                        </td>
                        <td className="p-3 text-center text-gray-500 group-hover:text-white transition-colors">
                          {expandedEventId === event.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        <td className={`p-3 text-[10px] md:text-sm text-right font-mono font-medium ${
                          event.actual && event.forecast && parseFloat(event.actual) > parseFloat(event.forecast) 
                            ? 'text-green-400' 
                            : event.actual && event.forecast && parseFloat(event.actual) < parseFloat(event.forecast)
                              ? 'text-red-400'
                              : 'text-gray-300'
                        }`}>
                          {event.actual || '-'}
                        </td>
                        <td className="p-3 text-[10px] md:text-sm text-gray-400 text-right font-mono">{event.forecast || '-'}</td>
                        <td className="p-3 text-[10px] md:text-sm text-gray-500 text-right font-mono">{event.previous || '-'}</td>
                        <td className="p-3 text-center">
                          <button className="text-gray-600 hover:text-brand-primary transition-colors">
                            <BarChart2 size={16} className="mx-auto" />
                          </button>
                        </td>
                      </tr>
                          
                          {/* Expanded Detail Row */}
                          <AnimatePresence>
                            {expandedEventId === event.id && (
                              <tr className="bg-black/40 border-b border-white/5">
                                <td colSpan={10} className="p-0">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-6 flex flex-col md:flex-row gap-8">
                                      <div className="flex-1">
                                        <h4 className="text-sm font-bold text-white mb-2">Description</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                          {event.description}
                                        </p>
                                      </div>
                                      <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                          <BarChart2 size={16} className="text-brand-primary" />
                                          Historical Data
                                        </h4>
                                        <div className="h-24 w-full bg-white/5 rounded-lg border border-white/10 flex items-end justify-between p-4 gap-2">
                                          {/* Mock Graph Bars */}
                                          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <div key={i} className="w-full bg-brand-primary/20 rounded-t-sm relative group">
                                              <div 
                                                className="absolute bottom-0 left-0 right-0 bg-brand-primary rounded-t-sm transition-all duration-500"
                                                style={{ height: `${h}%` }}
                                              ></div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* News Feed Section (Secondary) */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Newspaper className="text-brand-primary" size={20} />
            Latest Market News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_NEWS.map(news => (
              <div key={news.id} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] md:text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                    {news.source}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {news.time}
                  </span>
                </div>
                <h3 className="text-sm md:text-lg font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                  {news.title}
                </h3>
                <p className="text-[10px] md:text-sm text-gray-400 line-clamp-2 leading-tight">
                  {news.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
