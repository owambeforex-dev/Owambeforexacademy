import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Camera, User, CheckCircle2, Shield, 
  ChevronRight, Lock, Smartphone, Mail, Fingerprint, 
  ShieldCheck, AlertCircle, Clock, Info, Globe
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import StickyHeader from '../components/StickyHeader';

type VerificationMethod = 'NIN' | 'Passport' | 'SSN' | null;

export default function EditProfile() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  // Profile State
  const [username, setUsername] = useState(() => localStorage.getItem('owambe_username') || (userData?.firstName ? `${userData.firstName} ${userData.lastName}` : 'Owambe Trader'));
  const [profilePic, setProfilePic] = useState<string | null>(() => userData?.profileImage || localStorage.getItem('owambe_profile_pic'));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uid = currentUser?.uid?.substring(0, 6).toUpperCase() || '938366';

  // Update profilePic when userData changes
  useEffect(() => {
    if (userData?.profileImage) {
      setProfilePic(userData.profileImage);
    }
  }, [userData]);

  // Verification State
  const [isUS, setIsUS] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>(() => {
    return (localStorage.getItem('owambe_kyc_method') as VerificationMethod) || null;
  });
  const [kycStatus, setKycStatus] = useState<'Not Verified' | 'Pending' | 'Verified'>(() => {
    return (localStorage.getItem('owambe_kyc_status') as any) || 'Not Verified';
  });
  const [ssnValue, setSsnValue] = useState('');

  // Security States
  const [securityItems, setSecurityItems] = useState({
    passkey: localStorage.getItem('owambe_sec_passkey') === 'true',
    biometric: localStorage.getItem('owambe_sec_biometric') === 'true',
    twoFactor: localStorage.getItem('owambe_sec_2fa') === 'true',
    emailVerified: true // Default true for now as they are logged in
  });

  // Trust Score Calculation
  const [trustScore, setTrustScore] = useState(0);

  useEffect(() => {
    let score = 0;
    
    // Verification (40%)
    if (kycStatus === 'Verified') score += 40;
    else if (kycStatus === 'Pending') score += 20;

    // Security (40% total, 10% each)
    if (securityItems.passkey) score += 10;
    if (securityItems.biometric) score += 10;
    if (securityItems.twoFactor) score += 10;
    if (securityItems.emailVerified) score += 10;

    // Activity (20% - Mocked for now)
    score += 15; // Assume some activity

    setTrustScore(score);
  }, [kycStatus, securityItems]);

  const getLevelBadge = (score: number) => {
    if (score <= 30) return { label: 'Beginner', color: 'text-text-muted bg-bg-secondary' };
    if (score <= 60) return { label: 'Verified', color: 'text-success bg-success/10' };
    if (score <= 85) return { label: 'Trusted', color: 'text-brand-primary bg-brand-primary/10' };
    return { label: 'Elite', color: 'text-warning bg-warning/10' };
  };

  const badge = getLevelBadge(trustScore);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 1MB for base64 in Firestore)
      if (file.size > 1024 * 1024) {
        alert("Image must be smaller than 1MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setProfilePic(base64);
        localStorage.setItem('owambe_profile_pic', base64);
        
        // Save to Firestore
        if (currentUser) {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
              profileImage: base64,
              updatedAt: new Date().toISOString()
            });
          } catch (error) {
            console.error("Error updating profile image:", error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycSubmit = (method: VerificationMethod) => {
    if (kycStatus === 'Verified') return;
    setSelectedMethod(method);
    setKycStatus('Pending');
    localStorage.setItem('owambe_kyc_method', method || '');
    localStorage.setItem('owambe_kyc_status', 'Pending');
  };

  const toggleSecurity = (key: keyof typeof securityItems) => {
    const newValue = !securityItems[key];
    setSecurityItems(prev => ({ ...prev, [key]: newValue }));
    const storageKey = `owambe_sec_${key === 'twoFactor' ? '2fa' : String(key)}`;
    localStorage.setItem(storageKey, newValue.toString());
  };

  const handleSave = () => {
    localStorage.setItem('owambe_username', username);
    navigate('/profile');
  };

  const isFullySecured = Object.values(securityItems).every(v => v);

  return (
    <div className="min-h-screen bg-bg-primary pt-16 pb-12">
      <StickyHeader title="Edit Profile" />
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-primary px-4 h-16 flex items-center gap-4 border-b border-border-base">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-surface-hover text-text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Edit Profile</h1>
      </div>

      <div className="container mx-auto px-4 max-w-2xl mt-4 space-y-6">
        
        {/* 1. Profile Header Card */}
        <div className="bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-bg-secondary border-4 border-brand-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-primary transition-all"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-text-muted" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="w-full space-y-3">
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-bg-secondary border border-border-base rounded-xl py-3 px-4 text-text-primary text-center font-bold focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Owambe ID (UID)</label>
                <div className="w-full bg-bg-secondary/50 border border-border-base rounded-xl py-3 px-4 text-text-muted font-mono text-sm">
                  {uid}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Trust Score System */}
        <div className="bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="text-brand-primary" size={20} />
              <h3 className="text-sm font-bold text-text-primary">Trust Score</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-text-primary">{trustScore}%</span>
              <span className="text-xs text-text-muted font-medium">Goal: 100%</span>
            </div>
            <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${trustScore}%` }}
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
              />
            </div>
            <p className="text-[10px] text-text-muted leading-tight">
              Your trust score is calculated based on verification, security settings, and platform activity.
            </p>
          </div>
        </div>

        {/* 3. Verification (KYC) */}
        <div className="bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-success" size={20} />
              <h3 className="text-sm font-bold text-text-primary">Identity Verification</h3>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
              kycStatus === 'Verified' ? 'bg-success/10 text-success' :
              kycStatus === 'Pending' ? 'bg-warning/10 text-warning' :
              'bg-bg-secondary text-text-muted'
            }`}>
              {kycStatus === 'Verified' ? <CheckCircle2 size={12} /> : 
               kycStatus === 'Pending' ? <Clock size={12} /> : 
               <AlertCircle size={12} />}
              {kycStatus}
            </div>
          </div>

          <div className="space-y-4">
            {/* US Toggle */}
            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-2xl border border-border-base">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-text-muted" />
                <span className="text-xs font-bold text-text-primary">I am from the United States</span>
              </div>
              <button 
                onClick={() => setIsUS(!isUS)}
                className={`w-10 h-5 rounded-full transition-all relative ${isUS ? 'bg-brand-primary' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isUS ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {/* Methods */}
            <div className="space-y-3">
              {[
                { id: 'NIN', label: 'National ID (NIN)', icon: Smartphone, show: true },
                { id: 'Passport', label: 'International Passport', icon: Globe, show: true },
                { id: 'SSN', label: 'Social Security Number (SSN)', icon: Lock, show: isUS }
              ].filter(m => m.show).map((method) => {
                const isActive = selectedMethod === method.id;
                const isHidden = selectedMethod && selectedMethod !== method.id && kycStatus !== 'Not Verified';

                if (isHidden) return null;

                return (
                  <div 
                    key={method.id}
                    onClick={() => handleKycSubmit(method.id as VerificationMethod)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      isActive 
                        ? 'bg-brand-primary/5 border-brand-primary shadow-sm' 
                        : 'bg-bg-secondary border-border-base hover:border-brand-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isActive ? 'bg-brand-primary text-bg-primary' : 'bg-surface text-text-muted group-hover:text-brand-primary'
                        }`}>
                          <method.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">{method.label}</h4>
                          <p className="text-[10px] text-text-muted">Requires photo upload & verification</p>
                        </div>
                      </div>
                      {isActive ? (
                        <CheckCircle2 size={20} className="text-brand-primary" />
                      ) : (
                        <ChevronRight size={18} className="text-text-muted" />
                      )}
                    </div>

                    {isActive && method.id === 'SSN' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-4 pt-4 border-t border-brand-primary/10 space-y-3"
                      >
                        <input 
                          type="text" 
                          placeholder="Enter SSN"
                          value={ssnValue}
                          onChange={(e) => setSsnValue(e.target.value)}
                          className="w-full bg-surface border border-border-base rounded-xl py-2 px-4 text-text-primary text-sm focus:border-brand-primary outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="aspect-video bg-surface border border-dashed border-border-base rounded-xl flex flex-col items-center justify-center gap-1 text-text-muted">
                            <Camera size={16} />
                            <span className="text-[8px] font-bold uppercase">Front View</span>
                          </div>
                          <div className="aspect-video bg-surface border border-dashed border-border-base rounded-xl flex flex-col items-center justify-center gap-1 text-text-muted">
                            <Camera size={16} />
                            <span className="text-[8px] font-bold uppercase">Back View</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Security Section */}
        <div className="bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Lock className="text-warning" size={20} />
              <h3 className="text-sm font-bold text-text-primary">Security Center</h3>
            </div>
            {isFullySecured && (
              <span className="text-[10px] font-bold text-success flex items-center gap-1">
                <CheckCircle2 size={12} /> Account Fully Secured
              </span>
            )}
          </div>

          <div className="space-y-3">
            {[
              { id: 'passkey', label: 'Passkey', icon: Lock, status: securityItems.passkey },
              { id: 'biometric', label: 'Biometric Authentication', icon: Fingerprint, status: securityItems.biometric },
              { id: 'twoFactor', label: 'Two-Factor Authentication (2FA)', icon: Smartphone, status: securityItems.twoFactor },
              { id: 'emailVerified', label: 'Email Verification', icon: Mail, status: securityItems.emailVerified, disabled: true }
            ].map((item) => (
              <div 
                key={item.id}
                onClick={() => !item.disabled && toggleSecurity(item.id as any)}
                className="flex items-center justify-between p-4 bg-bg-secondary rounded-2xl border border-border-base hover:border-brand-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    item.status ? 'bg-success/10 text-success' : 'bg-surface text-text-muted group-hover:text-brand-primary'
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-xs font-bold text-text-primary">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${item.status ? 'text-success' : 'text-text-muted'}`}>
                    {item.status ? 'Active' : 'Not Active'}
                  </span>
                  {item.status ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <ChevronRight size={16} className="text-text-muted" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
