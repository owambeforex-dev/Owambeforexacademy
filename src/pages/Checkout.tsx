import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, ChevronRight, ChevronLeft, 
  ChevronDown, Search, Lock, X, User, ShieldCheck
} from 'lucide-react';
import StickyHeader from '../components/StickyHeader';
import { countries } from 'countries-list';

// Generate country list with flags and dial codes
const getFlagEmoji = (countryCode: string) => 
  countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));

const COUNTRY_LIST = Object.entries(countries).map(([code, data]) => ({
  code,
  name: data.name,
  dialCode: `+${data.phone[0]}`,
  flag: getFlagEmoji(code)
})).sort((a, b) => a.name.localeCompare(b.name));

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const propFirmService = location.state?.propFirmService;
  const investmentService = location.state?.investmentService;
  const plan = !propFirmService && !investmentService ? (location.state?.plan || { title: '1 Month Mentorship', price: '$199', duration: '1 Month' }) : null;

  const priceString = propFirmService ? `$${propFirmService.price}` : investmentService ? `$${investmentService.amount.toLocaleString()}` : plan!.price;
  const planPriceValue = parseFloat(priceString.replace('$', '').replace(/,/g, ''));
  const title = propFirmService ? propFirmService.title : investmentService ? investmentService.title : plan!.title;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Section 1 State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    phone: '',
    telegram: '',
  });
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  // Filtered countries
  const filteredCountries = COUNTRY_LIST.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.dialCode.includes(countrySearch)
  );

  const selectedCountryData = COUNTRY_LIST.find(c => c.code === formData.country);



  const allFieldsFilled = investmentService ? true : Boolean(
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.country &&
    formData.phone.trim() &&
    formData.telegram.trim()
  );


  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg-primary relative overflow-hidden">
      <StickyHeader title={investmentService ? "Investment Summary" : "Checkout"} />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
            {investmentService ? 'Investment' : (propFirmService ? 'Service' : 'Mentorship')} <span className="text-brand-primary">{investmentService ? 'Summary' : 'Checkout'}</span>
          </h1>
          <p className="text-text-secondary">{investmentService ? 'Review your investment details before proceeding' : `Complete your payment for the ${title}`}</p>
        </div>

        <div className="glass-dark rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl">
          {/* Persistent Ticket (Hidden for Investment as it's moved into Step 1) */}
          {!investmentService && (
            propFirmService ? (
              <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-6 mb-10">
                <h3 className="text-sm text-brand-primary uppercase tracking-wider font-bold mb-4">Service Summary Ticket</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-border-base pb-3">
                    <span className="text-text-secondary">Service:</span>
                    <span className="font-medium text-text-primary">{propFirmService.title}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border-base pb-3">
                    <span className="text-text-secondary">Evaluation Type:</span>
                    <span className="font-medium text-text-primary">{propFirmService.evaluationType}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border-base pb-3">
                    <span className="text-text-secondary">Account Size:</span>
                    <span className="font-medium text-text-primary font-mono">${propFirmService.accountSize.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-text-secondary font-medium">Service Fee:</span>
                    <span className="text-2xl font-mono font-bold text-brand-primary">${propFirmService.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-base p-6 mb-10">
                <h3 className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-2">Selected Plan</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-serif font-bold text-white">{plan!.title}</span>
                  <span className="text-xl font-mono font-bold text-brand-primary">{plan!.price}</span>
                </div>
              </div>
            )
          )}

          <div className="space-y-10">
            
            {/* ENROLLMENT / REVIEW */}
            <div className="transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                  {investmentService ? 'Investment Review' : 'Enrollment Details'}
                </h2>
              </div>

              <div className="space-y-5">
                {investmentService ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Column 1: Investment Summary */}
                      <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-6">
                        <h3 className="text-sm text-brand-primary uppercase tracking-wider font-bold mb-4">Investment Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center border-b border-border-base pb-3">
                            <span className="text-text-secondary">Investment Plan:</span>
                            <span className="font-medium text-text-primary">{investmentService.title}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border-base pb-3">
                            <span className="text-text-secondary">Investment Duration:</span>
                            <span className="font-medium text-text-primary">{investmentService.duration}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border-base pb-3">
                            <span className="text-text-secondary">Investment Date:</span>
                            <span className="font-medium text-text-primary">{investmentService.date}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border-base pb-3">
                            <span className="text-text-secondary">Expected ROI:</span>
                            <span className="font-medium text-text-primary">{investmentService.roi}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-border-base pb-3">
                            <span className="text-text-secondary">Investment Status:</span>
                            <span className="font-medium text-warning">Pending</span>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-text-secondary font-medium">Investment Amount:</span>
                            <span className="text-2xl font-mono font-bold text-brand-primary">${investmentService.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                        {/* Column 2: Terms and Agreement */}
                        <div className="space-y-6">
                          <label className="flex items-start gap-3 cursor-pointer group pt-2">
                            <div className="relative flex items-center justify-center mt-0.5">
                              <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="peer appearance-none w-5 h-5 rounded border border-border-base bg-bg-secondary checked:bg-brand-primary checked:border-brand-primary transition-colors cursor-pointer"
                              />
                              <CheckCircle2 size={14} className="absolute text-bg-primary opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                              I understand and agree to the <Link to="/investment-terms" target="_blank" className="text-brand-primary hover:underline">Terms of Service</Link>
                            </span>
                          </label>
                        </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Full Name</label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Email Address</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2 relative">
                          <label className="text-sm text-text-secondary">Country</label>
                          <div 
                            className="w-full bg-bg-secondary border border-border-base rounded-xl px-4 py-3 text-text-primary cursor-pointer flex items-center justify-between hover:border-brand-primary/30 transition-colors"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          >
                            {selectedCountryData ? (
                              <span className="flex items-center gap-2">
                                <span className="text-xl">{selectedCountryData.flag}</span>
                                <span>{selectedCountryData.name} ({selectedCountryData.dialCode})</span>
                              </span>
                            ) : (
                              <span className="text-text-muted">Select your country</span>
                            )}
                            <ChevronDown size={18} className="text-text-secondary" />
                          </div>

                          <AnimatePresence>
                            {isCountryDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-base rounded-xl shadow-2xl z-50 overflow-hidden"
                              >
                                <div className="p-3 border-b border-border-base relative">
                                  <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                                  <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search country..."
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="w-full bg-bg-primary border border-border-base rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                                  />
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                  {filteredCountries.map(country => (
                                    <div
                                      key={country.code}
                                      onClick={() => {
                                        setFormData({ ...formData, country: country.code });
                                        setIsCountryDropdownOpen(false);
                                        setCountrySearch('');
                                      }}
                                      className="px-4 py-3 hover:bg-surface-hover cursor-pointer flex items-center gap-3 text-text-primary transition-colors"
                                    >
                                      <span className="text-xl">{country.flag}</span>
                                      <span>{country.name}</span>
                                      <span className="text-text-muted ml-auto">{country.dialCode}</span>
                                    </div>
                                  ))}
                                  {filteredCountries.length === 0 && (
                                    <div className="p-4 text-center text-text-muted text-sm">No countries found</div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Phone Number</label>
                          <div className="flex gap-2">
                            <div className="flex items-center justify-center px-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 min-w-[70px]">
                              {selectedCountryData?.dialCode || '+'}
                            </div>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                              placeholder="123 456 7890"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Telegram Username</label>
                        <input
                          type="text"
                          value={formData.telegram}
                          onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                          placeholder="@username"
                        />
                      </div>

                      <AnimatePresence>
                        {allFieldsFilled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6"
                          >
                            <label className="flex items-start gap-3 cursor-pointer group pt-4">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={termsAccepted}
                                  onChange={(e) => setTermsAccepted(e.target.checked)}
                                  className="peer appearance-none w-5 h-5 rounded border border-border-base bg-bg-secondary checked:bg-brand-primary checked:border-brand-primary transition-colors cursor-pointer"
                                />
                                <CheckCircle2 size={14} className="absolute text-bg-primary opacity-0 peer-checked:opacity-100 pointer-events-none" />
                              </div>
                              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">I understand and agree to the terms of this service</span>
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  <AnimatePresence>
                    {allFieldsFilled && termsAccepted && (
                      <motion.button
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        onClick={() => setShowConfirmModal(true)}
                        className="w-full py-4 bg-brand-primary text-bg-primary font-bold rounded-xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,162,0,0.3)] hover:shadow-[0_0_25px_rgba(255,162,0,0.5)] overflow-hidden"
                      >
                        Confirm and Proceed to Payment <ChevronRight size={18} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface border border-border-base rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Proceed to next step?</h3>
              <p className="text-text-secondary text-sm mb-8">You are about to move to the payment section to complete your investment.</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="py-3 px-6 rounded-xl border border-border-base text-text-primary font-bold hover:bg-surface-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    navigate('/payment', { 
                      state: { 
                        title, 
                        priceValue: planPriceValue 
                      } 
                    });
                  }}
                  className="py-3 px-6 rounded-xl bg-brand-primary text-bg-primary font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
