import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ChevronLeft,
  Eye,
  EyeOff,
  Github,
  Facebook,
  Chrome
} from 'lucide-react';
import { auth, googleProvider, facebookProvider, db } from '../firebase/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot-password';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (currentUser && !loading) {
      navigate(from, { replace: true });
    }
  }, [currentUser, loading, navigate, from]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile
        await updateProfile(user, { displayName: name });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          phone: phone,
          role: 'user',
          identityVerified: false,
          myReferralCode: user.uid.substring(0, 8).toUpperCase(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Create initial wallet
        await setDoc(doc(db, 'wallets', user.uid), {
          balance: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          totalProfit: 0,
          updatedAt: new Date().toISOString()
        });

        await sendEmailVerification(user);
        setSuccessMessage("Account created! Please check your email for verification.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = "An error occurred during authentication.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = "Invalid email or password.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "Email is already in use.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider: any) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'user',
          identityVerified: false,
          myReferralCode: user.uid.substring(0, 8).toUpperCase(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        await setDoc(doc(db, 'wallets', user.uid), {
          balance: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          totalProfit: 0,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error("Social auth error:", err);
      setError(err.message || "Social authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/20">
          <span className="text-bg-primary text-3xl font-bold">B</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">Owambe Forex</h1>
        <p className="text-text-secondary text-[10px] md:text-sm">Your gateway to financial freedom</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface border border-border-base rounded-3xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-[10px] md:text-sm font-bold border-b-2 transition-all ${mode === 'login' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-[10px] md:text-sm font-bold border-b-2 transition-all ${mode === 'signup' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted'}`}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form 
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            onSubmit={handleAuth}
            className="space-y-4"
          >
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-bg-secondary border border-border-base rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:border-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="w-full bg-bg-secondary border border-border-base rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:border-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-bg-secondary border border-border-base rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-secondary border border-border-base rounded-xl py-3.5 pl-12 pr-12 text-text-primary focus:border-brand-primary outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-success/10 border border-success/20 text-success p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{successMessage}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-primary text-bg-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-50 transition-all mt-2"
            >
              {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : (
                <>
                  {mode === 'login' ? 'Login' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-base"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-4 text-text-muted font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSocialAuth(googleProvider)}
            className="flex items-center justify-center gap-3 py-3 bg-bg-secondary border border-border-base rounded-xl text-text-primary hover:bg-surface-hover transition-all font-medium text-[10px] md:text-sm"
          >
            <Chrome size={18} />
            Google
          </button>
          <button 
            onClick={() => handleSocialAuth(facebookProvider)}
            className="flex items-center justify-center gap-3 py-3 bg-bg-secondary border border-border-base rounded-xl text-text-primary hover:bg-surface-hover transition-all font-medium text-[10px] md:text-sm"
          >
            <Facebook size={18} />
            Facebook
          </button>
        </div>

        <p className="mt-8 text-center text-[8px] md:text-xs text-text-muted leading-relaxed">
          By continuing, you agree to our <br />
          <button className="text-text-primary font-bold hover:underline">Terms of Service</button> and <button className="text-text-primary font-bold hover:underline">Privacy Policy</button>
        </p>
      </motion.div>
    </div>
  );
}
