import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Copy, CheckCircle2, Shield, ChevronRight, X, Maximize2, Headset, Settings, Share2, 
  Camera, Upload, ShieldCheck, FileText, Lock, Info, AlertCircle, Clock, UserCircle, MessageCircle
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import StickyHeader from '../components/StickyHeader';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(() => userData?.profileImage || localStorage.getItem('owambe_profile_pic'));
  const [verificationStatus, setVerificationStatus] = useState<'Not Verified' | 'Pending' | 'Verified'>(() => {
    if (userData?.identityVerified) return 'Verified';
    return (localStorage.getItem('owambe_kyc_status') as any) || 'Not Verified';
  });

  // Update profilePic when userData changes
  useEffect(() => {
    if (userData?.profileImage) {
      setProfilePic(userData.profileImage);
    }
  }, [userData]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uid = currentUser?.uid?.substring(0, 6).toUpperCase() || '938366';
  const username = localStorage.getItem('owambe_username') || (userData?.firstName ? `${userData.firstName} ${userData.lastName}` : 'Owambe Trader');

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uid);
    setCopied(true);
    showToast('Copied successfully');
    setTimeout(() => setCopied(false), 2000);
  };

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
            showToast('Profile picture updated');
          } catch (error) {
            console.error("Error updating profile image:", error);
            showToast('Failed to update profile picture');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-12 pb-24">
      <StickyHeader title="Profile" />
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-primary px-4 h-16 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-text-primary p-2 hover:bg-surface-hover rounded-full transition-colors">
          <X size={24} />
        </button>
        <div className="flex items-center gap-1">
          <button className="text-text-primary p-2 hover:bg-surface-hover rounded-full transition-colors"><Maximize2 size={22} /></button>
          <button onClick={() => navigate('/support')} className="text-text-primary p-2 hover:bg-surface-hover rounded-full transition-colors"><Headset size={22} /></button>
          <button onClick={() => navigate('/settings')} className="text-text-primary p-2 hover:bg-surface-hover rounded-full transition-colors"><Settings size={22} /></button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl">
        {/* Top Profile Section (Binance Style) */}
        <div className="mt-8 mb-6 bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <div 
                onClick={triggerFileInput}
                className="w-20 h-20 rounded-full bg-bg-secondary border-2 border-brand-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-primary transition-all"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-text-muted" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera size={20} className="text-white" />
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
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-text-primary">{username}</h1>
                <button className="text-text-muted hover:text-brand-primary transition-colors p-1">
                  <Share2 size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-text-secondary font-mono">UID: {uid}</span>
                <button onClick={handleCopyUid} className="relative text-text-muted hover:text-brand-primary transition-colors">
                  {copied ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  verificationStatus === 'Verified' ? 'bg-success/10 text-success' :
                  verificationStatus === 'Pending' ? 'bg-warning/10 text-warning' :
                  'bg-bg-secondary text-text-muted'
                }`}>
                  {verificationStatus === 'Verified' ? <CheckCircle2 size={10} /> : 
                   verificationStatus === 'Pending' ? <Clock size={10} /> : 
                   <AlertCircle size={10} />}
                  {verificationStatus}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-bg-secondary text-text-secondary text-[10px] font-bold">Regular</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/edit-profile')}
            className="w-full py-2 bg-bg-secondary hover:bg-surface-hover text-text-primary text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Edit Profile <ChevronRight size={14} />
          </button>
        </div>

        {/* Verification Card (Binance Style) */}
        {verificationStatus !== 'Verified' && (
          <div className="mb-6 bg-surface p-5 rounded-3xl border border-border-base shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-primary/10 transition-all"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text-primary mb-0.5">Verify Your Identity</h3>
                <p className="text-[11px] text-text-muted leading-tight">Complete verification to unlock all features and increase your limits.</p>
              </div>
              <Link to="/edit-profile" className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary hover:bg-brand-primary hover:text-bg-primary transition-all">
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-3xl border border-border-base shadow-sm h-32 flex flex-col justify-between group active:scale-[0.98] transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-text-primary text-xs font-bold mb-0.5">Earn</h3>
              <p className="text-text-muted text-[10px] leading-tight">Earn passive income on your assets</p>
            </div>
          </div>
          <div className="bg-surface p-4 rounded-3xl border border-border-base shadow-sm h-32 flex flex-col justify-between group active:scale-[0.98] transition-all">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
              <Maximize2 size={20} />
            </div>
            <div>
              <h3 className="text-text-primary text-xs font-bold mb-0.5">For You</h3>
              <p className="text-text-muted text-[10px] leading-tight">Latest trading competitions & airdrops</p>
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="space-y-4">
          <div className="bg-surface p-4 rounded-3xl border border-border-base flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary">
                <FileText size={18} />
              </div>
              <span className="text-text-primary text-sm font-medium">My Vouchers</span>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </div>

          {/* Legal & Policies Card (Upgraded) */}
          <div className="bg-surface rounded-3xl border border-border-base shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border-base">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Legal & Policies</h3>
            </div>
            <div className="divide-y divide-border-base">
              <Link to="/terms" className="flex items-center justify-between p-4 hover:bg-surface-hover transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <span className="text-text-primary text-sm font-medium">Privacy Policy</span>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </Link>
              <Link to="/terms" className="flex items-center justify-between p-4 hover:bg-surface-hover transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary transition-colors">
                    <FileText size={18} />
                  </div>
                  <span className="text-text-primary text-sm font-medium">Terms of Service</span>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </Link>
            </div>
          </div>

          <Link to="/about" className="bg-surface p-4 rounded-3xl border border-border-base flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-bg-secondary flex items-center justify-center text-text-secondary group-hover:text-brand-primary transition-colors">
                <Info size={18} />
              </div>
              <span className="text-text-primary text-sm font-medium">About Us</span>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </Link>

          <div className="bg-surface p-4 rounded-3xl border border-border-base flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-bg-primary font-bold text-[10px]">B</div>
              <span className="text-text-primary font-bold">BINANCE <span className="text-brand-primary">Lite</span></span>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </div>
        </div>
      </div>

      {/* Profile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border-base h-20 flex items-center justify-around pb-safe">
        <button className="flex flex-col items-center gap-1 text-brand-primary">
          <UserCircle size={24} />
          <span className="text-[10px] font-medium">Me</span>
        </button>
        <button onClick={() => navigate('/ai-insights')} className="flex flex-col items-center gap-1 text-text-secondary hover:text-brand-primary transition-colors">
          <div className="relative">
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-bg-primary text-[7px] font-bold rounded-full flex items-center justify-center border border-surface">2</span>
          </div>
          <span className="text-[10px] font-medium">Chat</span>
        </button>
      </div>
    </div>
  );
}
