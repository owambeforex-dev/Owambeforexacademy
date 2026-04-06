import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, Bell, Globe, CreditCard, 
  Trash2, HelpCircle, Shield, Info, RefreshCw, 
  Smartphone, MessageSquare, Wallet, Layout, Palette, Clock,
  User, Mail, Lock, LogOut, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import StickyHeader from '../components/StickyHeader';

type ThemeMode = 'light' | 'dark' | 'system';

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, userData, refreshUserData, logout } = useAuth();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode') as ThemeMode;
    return saved || 'system';
  });
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  // Account Management States
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountTab, setAccountTab] = useState<'profile' | 'security'>('profile');
  const [newName, setNewName] = useState(currentUser?.displayName || '');
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const applyTheme = (mode: ThemeMode) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      
      let effectiveTheme = mode;
      if (mode === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      root.classList.add(effectiveTheme);
      localStorage.setItem('theme-mode', mode);
      localStorage.setItem('theme', effectiveTheme);
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
    setShowThemeModal(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Mock profile update
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Profile updated successfully (Mock)!' });
        setIsSubmitting(false);
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setIsSubmitting(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Mock security update
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Security settings updated (Mock)!' });
        setCurrentPassword('');
        setNewPassword('');
        setIsSubmitting(false);
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    logout();
    navigate('/auth');
  };

  const SettingItem = ({ 
    icon: Icon, 
    label, 
    value, 
    onClick, 
    to,
    badge,
    danger
  }: { 
    icon?: any, 
    label: string, 
    value?: string, 
    onClick?: () => void,
    to?: string,
    badge?: string,
    danger?: boolean
  }) => {
    const content = (
      <div className="flex items-center justify-between py-3.5 group cursor-pointer border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className={danger ? "text-error" : "text-gray-500 dark:text-gray-400"} />}
          <span className={`text-sm font-medium ${danger ? "text-error" : "text-gray-900 dark:text-gray-200"}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {value && <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>}
          {badge && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{badge}</span>
            </span>
          )}
          <ChevronRight size={16} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
        </div>
      </div>
    );

    if (to) return <Link to={to}>{content}</Link>;
    return <div onClick={onClick}>{content}</div>;
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="pt-6 pb-2">
      <h3 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0e11] pt-16 pb-12">
      <StickyHeader title="Settings" />
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0b0e11] px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="space-y-0 mt-4">
          <SectionHeader title="Account" />
          <SettingItem 
            label="Account Management" 
            icon={User} 
            value={currentUser?.displayName || 'Set Name'} 
            onClick={() => setShowAccountModal(true)}
          />
          <SettingItem label="Security" icon={Shield} onClick={() => { setAccountTab('security'); setShowAccountModal(true); }} />
          
          <SectionHeader title="General" />
          <SettingItem label="Notification Preference" icon={Bell} />
          <SettingItem label="Currency" value="USD" icon={Wallet} />
          <SettingItem label="Language" value="English (Africa)" icon={Globe} />

          <SectionHeader title="Appearance" />
          <SettingItem 
            label="Theme" 
            icon={Layout}
            value={theme === 'system' ? 'Use device settings' : theme === 'dark' ? 'Dark mode' : 'Light mode'} 
            onClick={() => setShowThemeModal(true)}
          />
          <SettingItem label="Color Preference" icon={Palette} />

          <SectionHeader title="Others" />
          <SettingItem label="Help & Support" to="/support" icon={HelpCircle} />
          <SettingItem label="About Us" to="/about" icon={Info} />
          
          <div className="mt-8">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-error/10 text-error rounded-2xl font-bold hover:bg-error/20 transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Account Management Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white dark:bg-[#1e2329] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl h-[80vh] sm:h-auto overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h3>
                  <button onClick={() => setShowAccountModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft size={20} className="rotate-[-90deg]" />
                  </button>
                </div>

                <div className="flex gap-4 mb-6 border-b border-gray-100 dark:border-white/5">
                  <button 
                    onClick={() => setAccountTab('profile')}
                    className={`pb-2 text-sm font-bold transition-all ${accountTab === 'profile' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => setAccountTab('security')}
                    className={`pb-2 text-sm font-bold transition-all ${accountTab === 'security' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}
                  >
                    Security
                  </button>
                </div>

                {message && (
                  <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{message.text}</span>
                  </div>
                )}

                {accountTab === 'profile' ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-primary text-brand-dark rounded-xl font-bold disabled:opacity-50"
                    >
                      {isSubmitting ? <RefreshCw className="animate-spin mx-auto" size={20} /> : 'Update Profile'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleUpdateSecurity} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password (Required)</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="password" 
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="email" 
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Leave blank to keep current"
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-primary text-brand-dark rounded-xl font-bold disabled:opacity-50"
                    >
                      {isSubmitting ? <RefreshCw className="animate-spin mx-auto" size={20} /> : 'Save Security Changes'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Theme Selection Modal */}
      <AnimatePresence>
        {showThemeModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white dark:bg-[#1e2329] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Theme</h3>
                  <button onClick={() => setShowThemeModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                    <ArrowLeft size={20} className="rotate-[-90deg]" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {[
                    { id: 'light', label: 'Light mode' },
                    { id: 'dark', label: 'Dark mode' },
                    { id: 'system', label: 'Use device settings' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleThemeChange(option.id as ThemeMode)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                        theme === option.id 
                          ? 'bg-brand-primary/10 border-2 border-brand-primary text-brand-primary' 
                          : 'bg-gray-50 dark:bg-white/5 border-2 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                      {theme === option.id && <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-dark"></div>
                      </div>}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
