import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, Loader2, ExternalLink, AppWindow, Zap, TrendingUp, Brain, Info, HelpCircle, BookOpen, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { searchInternal, searchGemini, SearchResult } from '../services/searchService';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
}

const PLACEHOLDERS = [
  "Ask Owambe AI anything",
  "Learn and earn with us",
  "Invest, earn up to 30%",
  "Account management",
  "Premium signal services",
  "Pass your prop firm easily",
  "Search about today's market",
  "Check out for news events",
  "Explore our services"
];

const CATEGORY_ICONS: Record<string, any> = {
  'App': AppWindow,
  'Service': Zap,
  'Feature': TrendingUp,
  'AI': Brain
};

export default function SearchInput({ placeholder = "Search...", className = "", isMobile = false }: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResult, setAiResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Placeholder rotation
  useEffect(() => {
    if (isFocused || query) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isFocused, query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setAiResult(null);
      setIsLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      
      try {
        // 1. Internal Search
        const internalResults = await searchInternal(query);
        setResults(internalResults);

        // 2. Gemini Search (only if no internal results or if it looks like a market question)
        const isMarketQuestion = /price|gold|btc|market|trend|news|up|down/i.test(query);
        if (internalResults.length === 0 || isMarketQuestion) {
          const geminiRes = await searchGemini(query);
          setAiResult(geminiRes);
        } else {
          setAiResult(null);
        }
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsExpanded(false);
    setIsFocused(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0].path);
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className={`relative flex items-center w-full bg-surface border border-border-base transition-all focus-within:border-brand-primary/50 focus-within:shadow-md rounded-full ${isMobile ? 'h-[34px]' : 'h-10'}`}>
        <div className="relative flex-1 h-full flex items-center overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setIsExpanded(true);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full h-full bg-transparent text-text-primary text-xs focus:outline-none z-10 ${isMobile ? 'pl-3.5 pr-2' : 'pl-5 pr-3'}`}
          />
          
          <AnimatePresence mode="wait">
            {!query && !isFocused && (
              <motion.div
                key={placeholderIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`absolute ${isMobile ? 'left-3.5' : 'left-5'} text-text-muted text-xs pointer-events-none whitespace-nowrap`}
              >
                {PLACEHOLDERS[placeholderIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`flex items-center h-full ${isMobile ? 'pr-3' : 'pr-5'}`}>
          {isLoading ? (
            <Loader2 size={isMobile ? 14 : 18} className="text-brand-primary animate-spin" />
          ) : (
            <Search size={isMobile ? 14 : 18} className="text-text-secondary" />
          )}
          {!isMobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-text-secondary hover:text-brand-primary transition-colors flex items-center justify-center"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-base rounded-2xl shadow-xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col py-2">
              {/* Search Results */}
              {query.trim() ? (
                <>
                  {results.length === 0 && !aiResult && !isLoading && (
                    <div className="px-5 py-8 text-center text-text-muted text-sm">
                      No results found for "{query}"
                    </div>
                  )}

                  {/* Internal Results */}
                  {results.length > 0 && (
                    <div className="px-2 pb-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        App Results
                      </div>
                      {results.map((result) => {
                        const Icon = CATEGORY_ICONS[result.category] || Info;
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result.path)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover group transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary transition-colors">
                              <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors">
                                {result.title}
                              </div>
                              <div className="text-[10px] text-text-muted truncate">
                                {result.description}
                              </div>
                            </div>
                            <ExternalLink size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* AI Results */}
                  {aiResult && (
                    <div className="px-2 pt-2 border-t border-border-base">
                      <div className="px-3 py-1 text-[10px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1">
                        <Brain size={10} /> Live AI Insights
                      </div>
                      <div className="px-3 py-3">
                        <div className="bg-bg-secondary/50 rounded-xl p-3 border border-brand-primary/10">
                          <p className="text-xs text-text-primary leading-relaxed">
                            {aiResult.description}
                          </p>
                          <button 
                            onClick={() => handleResultClick(aiResult.path)}
                            className="mt-2 text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                          >
                            Explore AI Insights <ExternalLink size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Quick Links (Default State) */
                <div className="px-2">
                  <div className="px-3 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Quick Access
                  </div>
                  <Link
                    to="/about"
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary">
                      <Info size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-secondary group-hover:text-brand-primary">About Owambe</span>
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary">
                      <HelpCircle size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-secondary group-hover:text-brand-primary">FAQ</span>
                  </Link>
                  <Link
                    to="/free-resources"
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-secondary group-hover:text-brand-primary">Free Resources</span>
                  </Link>
                  <Link
                    to="/support"
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary">
                      <MessageSquare size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-secondary group-hover:text-brand-primary">Contact Support</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
