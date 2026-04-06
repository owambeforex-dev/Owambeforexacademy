import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, CheckCircle2, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import StickyHeader from '../components/StickyHeader';

const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  // Add more as needed
];

const BROKERS = [
  'IC Markets',
  'Pepperstone',
  'Exness',
  'XM',
  'FP Markets',
  'Tickmill',
  'HFM',
  'OANDA',
  'FXCM',
  'Eightcap',
  'BlackBull Markets',
  'RoboForex',
];

const PLATFORMS = [
  'MetaTrader 4',
  'MetaTrader 5',
  'cTrader',
  'TradingView',
  'NinjaTrader',
  'DXtrade',
  'Match-Trader',
  'Sierra Chart',
  'Thinkorswim',
  'Quantower',
  'ActTrader',
  'ProRealTime',
  'Currenex',
  'VertexFX',
  'TradeLocker',
  'Tradovate',
  'Interactive Brokers TWS',
  'Bloomberg Terminal',
  'Sterling Trader Pro',
  'CQG Trader',
  'MultiCharts',
  'Bookmap',
  'ATAS'
];

export default function AccountManagementApplication() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  
  // Section 1
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState(COUNTRIES.find(c => c.name === 'Nigeria') || COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Section 2
  const [broker, setBroker] = useState('');
  const [brokerSearch, setBrokerSearch] = useState('');
  const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
  const [accountSize, setAccountSize] = useState('');
  const [platform, setPlatform] = useState('MetaTrader 5');
  const [platformSearch, setPlatformSearch] = useState('');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [server, setServer] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  // Section 3
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const countryRef = useRef<HTMLDivElement>(null);
  const brokerRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (brokerRef.current && !brokerRef.current.contains(event.target as Node)) {
        setShowBrokerDropdown(false);
      }
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setShowPlatformDropdown(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCountryDropdown(false);
        setShowBrokerDropdown(false);
        setShowPlatformDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.includes(countrySearch));
  }, [countrySearch]);

  const filteredBrokers = useMemo(() => {
    return BROKERS.filter(b => b.toLowerCase().includes(brokerSearch.toLowerCase()));
  }, [brokerSearch]);

  const filteredPlatforms = useMemo(() => {
    return PLATFORMS.filter(p => p.toLowerCase().includes(platformSearch.toLowerCase()));
  }, [platformSearch]);

  const isFormValid = fullName && username && phoneNumber && broker && accountSize && platform && server && login && password;

  if (loading) {
    return (
      <div className="pt-32 pb-12 min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Verification Checks
    if (!BROKERS.includes(broker)) {
      setErrorMsg("Please verify your broker account details before submitting.");
      return;
    }
    if (isNaN(Number(accountSize)) || Number(accountSize) <= 0) {
      setErrorMsg("Please verify your broker account details before submitting.");
      return;
    }
    if (!PLATFORMS.includes(platform)) {
      setErrorMsg("Please verify your broker account details before submitting.");
      return;
    }
    if (!/^\d+$/.test(login)) {
      setErrorMsg("Please verify your broker account details before submitting.");
      return;
    }

    if (isFormValid) {
      setShowTerms(true);
    }
  };

  const handleSubmit = async () => {
    if (!agreed || !isFormValid) return;
    
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      // Duplicate check
      const q = query(
        collection(db, 'accountManagementApplications'), 
        where('userId', '==', currentUser?.uid || 'anonymous'),
        where('login', '==', login), 
        where('broker', '==', broker)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setErrorMsg("This account has already been submitted for management.");
        setIsSubmitting(false);
        setShowTerms(false);
        return;
      }

      await addDoc(collection(db, 'accountManagementApplications'), {
        userId: currentUser?.uid || 'anonymous',
        fullName,
        username,
        phone: `${country.code} ${phoneNumber}`,
        broker,
        accountSize: Number(accountSize),
        platform,
        server,
        login,
        password, // In a real app, this should be encrypted before sending, but per requirements we send it securely to admin dashboard. Firestore rules should restrict access.
        status: 'Pending Review',
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center glass-dark p-12 rounded-3xl border border-brand-primary/30 max-w-md w-full">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Application Submitted Successfully</h2>
          <p className="text-gray-400 mb-8">Your account management request has been received and is currently under review.</p>
          <Link 
            to="/dashboard"
            className="inline-flex items-center justify-center w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-brand-secondary transition-colors"
          >
            Go Back To Your Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-dark">
      <StickyHeader title="Application Form" />
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/services/account-management" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors mb-8">
          <ArrowLeft size={20} /> Back to Account Management
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">Account Management <span className="text-brand-primary">Application</span></h1>
          <p className="text-gray-400">Please provide your details and trading account credentials securely below.</p>
        </div>

        <form onSubmit={handleReview} className="space-y-12">
          
          {/* Section 1: Personal Information */}
          <div className="glass-dark rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-sm">1</span>
              Personal Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="johndoe123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <div className="flex gap-2 relative">
                  <div className="relative" ref={countryRef}>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="h-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex items-center gap-2 hover:bg-white/10 transition-colors min-w-[120px]"
                    >
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                    </button>
                    
                    <AnimatePresence>
                      {showCountryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-[100] overflow-hidden"
                        >
                          <div className="p-2 border-b border-white/10">
                            <div className="relative">
                              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input
                                type="text"
                                placeholder="Search country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
                              />
                            </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredCountries.map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => {
                                  setCountry(c);
                                  setShowCountryDropdown(false);
                                  setCountrySearch('');
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm text-gray-300 flex items-center gap-3"
                              >
                                <span>{c.flag}</span>
                                <span className="flex-1">{c.name}</span>
                                <span className="text-gray-500">{c.code}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder="8012345678"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Trading Account Details */}
          <div className="glass-dark rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-sm">2</span>
              Trading Account Details
            </h2>
            
            <div className="space-y-6">
              <div className="relative" ref={brokerRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Broker Name</label>
                <div 
                  onClick={() => setShowBrokerDropdown(!showBrokerDropdown)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-pointer flex justify-between items-center"
                >
                  {broker || <span className="text-gray-500">Select Broker</span>}
                </div>
                
                <AnimatePresence>
                  {showBrokerDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-[100] overflow-hidden"
                    >
                      <div className="p-2 border-b border-white/10">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Search broker..."
                            value={brokerSearch}
                            onChange={(e) => setBrokerSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredBrokers.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => {
                              setBroker(b);
                              setShowBrokerDropdown(false);
                              setBrokerSearch('');
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm text-gray-300"
                          >
                            {b}
                          </button>
                        ))}
                        {filteredBrokers.length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500">No brokers found.</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Account Size (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={accountSize}
                      onChange={(e) => setAccountSize(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                      placeholder="10000"
                    />
                  </div>
                </div>
                
                <div className="relative" ref={platformRef}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Trading Platform</label>
                  <div 
                    onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-pointer flex justify-between items-center"
                  >
                    {platform || <span className="text-gray-500">Select Platform</span>}
                  </div>
                  
                  <AnimatePresence>
                    {showPlatformDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-[100] overflow-hidden"
                      >
                        <div className="p-2 border-b border-white/10">
                          <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                              type="text"
                              placeholder="Search platform..."
                              value={platformSearch}
                              onChange={(e) => setPlatformSearch(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          {filteredPlatforms.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => {
                                setPlatform(p);
                                setShowPlatformDropdown(false);
                                setPlatformSearch('');
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm text-gray-300"
                            >
                              {p}
                            </button>
                          ))}
                          {filteredPlatforms.length === 0 && (
                            <div className="px-4 py-3 text-sm text-gray-500">No platforms found.</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Broker Server</label>
                <input
                  type="text"
                  required
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="e.g. ICMarketsSC-MT5-02"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Broker Login ID</label>
                  <input
                    type="text"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors font-mono"
                    placeholder="12345678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Broker Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {!agreed ? (
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isFormValid ? 'bg-brand-primary text-brand-dark hover:shadow-[0_0_20px_rgba(255,162,0,0.3)]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
            >
              Review Application
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </form>
      </div>

      {/* Terms Popup */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-dark rounded-2xl border border-white/10 p-8 max-w-lg w-full relative"
            >
              <button 
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mb-6 text-brand-primary mx-auto">
                <ShieldCheck size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-center text-white mb-4">Terms of Service</h3>
              
              <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
                <p className="text-gray-300 text-center leading-relaxed">
                  "I confirm that the information provided is correct and I agree to the Account Management Service Terms."
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTerms(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setAgreed(true);
                    setShowTerms(false);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-brand-dark bg-brand-primary hover:bg-brand-secondary transition-colors"
                >
                  Agree
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
