import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  parsePhoneNumberFromString, 
  getCountries, 
  getCountryCallingCode,
  AsYouType,
  CountryCode
} from 'libphonenumber-js';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  RefreshCw,
  Eye,
  EyeOff,
  Facebook,
  Chrome,
  ShieldCheck,
  Search,
  ChevronDown,
  Globe
} from 'lucide-react';
import { auth, googleProvider, facebookProvider, db } from '../firebase/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

// Helper for country names (simplified for brevity, but covers major ones)
const countryNames: Record<string, string> = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AS: "American Samoa", AD: "Andorra", AO: "Angola", AI: "Anguilla", AQ: "Antarctica", AG: "Antigua and Barbuda", AR: "Argentina", AM: "Armenia", AW: "Aruba", AU: "Australia", AT: "Austria", AZ: "Azerbaijan", BS: "Bahamas", BH: "Bahrain", BD: "Bangladesh", BB: "Barbados", BY: "Belarus", BE: "Belgium", BZ: "Belize", BJ: "Benin", BM: "Bermuda", BT: "Bhutan", BO: "Bolivia", BA: "Bosnia and Herzegovina", BW: "Botswana", BR: "Brazil", IO: "British Indian Ocean Territory", BN: "Brunei Darussalam", BG: "Bulgaria", BF: "Burkina Faso", BI: "Burundi", KH: "Cambodia", CM: "Cameroon", CA: "Canada", CV: "Cape Verde", KY: "Cayman Islands", CF: "Central African Republic", TD: "Chad", CL: "Chile", CN: "China", CX: "Christmas Island", CC: "Cocos (Keeling) Islands", CO: "Colombia", KM: "Comoros", CG: "Congo", CD: "Congo, The Democratic Republic of the", CK: "Cook Islands", CR: "Costa Rica", CI: "Cote D'Ivoire", HR: "Croatia", CU: "Cuba", CY: "Cyprus", CZ: "Czech Republic", DK: "Denmark", DJ: "Dominio", DM: "Dominica", DO: "Dominican Republic", EC: "Ecuador", EG: "Egypt", SV: "El Salvador", GQ: "Equatorial Guinea", ER: "Eritrea", EE: "Estonia", ET: "Ethiopia", FK: "Falkland Islands (Malvinas)", FO: "Faroe Islands", FJ: "Fiji", FI: "Finland", FR: "France", GF: "French Guiana", PF: "French Polynesia", TF: "French Southern Territories", GA: "Gabon", GM: "Gambian", GE: "Georgia", DE: "Germany", GH: "Ghana", GI: "Gibraltar", GR: "Greece", GL: "Greenland", GD: "Grenada", GP: "Guadeloupe", GU: "Guam", GT: "Guatemala", GN: "Guinea", GW: "Guinea-Bissau", GY: "Guyana", HT: "Haiti", HM: "Heard Island and Mcdonald Islands", VA: "Holy See (Vatican City State)", HN: "Honduras", HK: "Hong Kong", HU: "Hungary", IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran, Islamic Republic of", IQ: "Iraq", IE: "Ireland", IL: "Israel", IT: "Italy", JM: "Jamaica", JP: "Japan", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya", KI: "Kiribati", KP: "Korea, Democratic People's Republic of", KR: "Korea, Republic of", KW: "Kuwait", KG: "Kyrgyzstan", LA: "Lao People's Democratic Republic", LV: "Latvia", LB: "Lebanon", LS: "Lesotho", LR: "Liberia", LY: "Libyan Arab Jamahiriya", LI: "Liechtenstein", LT: "Lithuania", LU: "Luxembourg", MO: "Macao", MK: "Macedonia, The Former Yugoslav Republic of", MG: "Madagascar", MW: "Malawi", MY: "Malaysia", MV: "Maldives", ML: "Mali", MT: "Malta", MH: "Marshall Islands", MQ: "Martinique", MR: "Mauritania", MU: "Mauritius", YT: "Mayotte", MX: "Mexico", FM: "Micronesia, Federated States of", MD: "Moldova, Republic of", MC: "Monaco", MN: "Mongolia", MS: "Montserrat", MA: "Morocco", MZ: "Mozambique", MM: "Myanmar", NA: "Namibia", NR: "Nauru", NP: "Nepal", NL: "Netherlands", AN: "Netherlands Antilles", NC: "New Caledonia", NZ: "New Zealand", NI: "Nicaragua", NE: "Niger", NG: "Nigeria", NU: "Niue", NF: "Norfolk Island", MP: "Northern Mariana Islands", NO: "Norway", OM: "Oman", PK: "Pakistan", PW: "Palau", PS: "Palestinian Territory, Occupied", PA: "Panama", PG: "Papua New Guinea", PY: "Paraguay", PE: "Peru", PH: "Philippines", PN: "Pitcairn", PL: "Poland", PT: "Portugal", PR: "Puerto Rico", QA: "Qatar", RE: "Reunion", RO: "Romania", RU: "Russian Federation", RW: "Rwanda", SH: "Saint Helena", KN: "Saint Kitts and Nevis", LC: "Saint Lucia", PM: "Saint Pierre and Miquelon", VC: "Saint Vincent and the Grenadines", WS: "Samoa", SM: "San Marino", ST: "Sao Tome and Principe", SA: "Saudi Arabia", SN: "Senegal", CS: "Serbia and Montenegro", SC: "Seychelles", SL: "Sierra Leone", SG: "Singapore", SK: "Slovakia", SI: "Slovenia", SB: "Solomon Islands", SO: "Somalia", ZA: "South Africa", GS: "South Georgia and the South Sandwich Islands", ES: "Spain", LK: "Sri Lanka", SD: "Sudan", SR: "Suriname", SJ: "Svalbard and Jan Mayen", SZ: "Swaziland", SE: "Sweden", CH: "Switzerland", SY: "Syrian Arab Republic", TW: "Taiwan, Province of China", TJ: "Tajikistan", TZ: "Tanzania, United Republic of", TH: "Thailand", TL: "Timor-Leste", TG: "Togo", TK: "Tokelau", TO: "Tonga", TT: "Trinidad and Tobago", TN: "Tunisia", TR: "Turkey", TM: "Turkmenistan", TC: "Turks and Caicos Islands", TV: "Tuvalu", UG: "Uganda", UA: "Ukraine", AE: "United Arab Emirates", GB: "United Kingdom", US: "United States", UM: "United States Minor Outlying Islands", UY: "Uruguay", UZ: "Uzbekistan", VU: "Vanuatu", VE: "Venezuela", VN: "Viet Nam", VG: "Virgin Islands, British", VI: "Virgin Islands, U.S.", WF: "Wallis and Futuna", EH: "Western Sahara", YE: "Yemen", ZM: "Zambia", ZW: "Zimbabwe"
};

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

type AuthMode = 'login' | 'signup';

const ADMIN_EMAIL = "info.realcipher@gmail.com";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userData, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('NG');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const from = (location.state as any)?.from?.pathname || "/overview";
  const needsVerification = (location.state as any)?.needsVerification || false;

  // Global loading state to prevent being stuck on login page while fetching role
  const isAuthLoading = loading || isSubmitting;

  useEffect(() => {
    if (currentUser && !loading && userData) {
      console.log("[Auth Page] User authenticated and data loaded. Role:", userData.role);
      
      if (currentUser.isAnonymous) {
        console.log("[Auth Page] Anonymous user, signing out");
        signOut(auth);
        return;
      }

      if (!currentUser.emailVerified && currentUser.email !== ADMIN_EMAIL) {
        console.log("[Auth Page] Email not verified, staying on auth page");
        // Stay on auth page to show verification message
        return;
      }

      if (userData.role === 'super_admin') {
        console.log("[Auth Page] Admin detected, redirecting to /admin-dashboard");
        navigate('/admin-dashboard', { replace: true });
      } else {
        console.log("[Auth Page] Regular user detected, redirecting to:", from);
        navigate(from, { replace: true });
      }
    }
  }, [currentUser, userData, loading, navigate, from]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const countries = useMemo(() => {
    return getCountries().map(code => ({
      code,
      name: countryNames[code] || code,
      dialCode: `+${getCountryCallingCode(code)}`,
      flag: getFlagEmoji(code)
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
      c.dialCode.includes(countrySearch)
    );
  }, [countries, countrySearch]);

  if (isAuthLoading && !error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-900 font-black animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (currentUser && (currentUser.emailVerified || currentUser.email === ADMIN_EMAIL) && userData) {
    if (userData.role === 'super_admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to={from} replace />;
  }

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name) return setError("Full name is required");
      
      const dialCode = getCountryCallingCode(selectedCountry);
      const fullPhone = `+${dialCode}${phone}`;
      const parsed = parsePhoneNumberFromString(fullPhone);
      
      if (!parsed || !parsed.isValid()) {
        return setError(`Invalid phone number for ${countryNames[selectedCountry]}`);
      }

      if (!validatePassword(password)) return setError("Password must be 8+ chars with uppercase, lowercase, number, and special character");
      if (password !== confirmPassword) return setError("Passwords do not match");
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        await sendEmailVerification(user);
        
        const dialCode = getCountryCallingCode(selectedCountry);
        const fullPhone = `+${dialCode}${phone}`;
        
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: name,
            email: user.email,
            phone: fullPhone,
            role: user.email === ADMIN_EMAIL ? 'super_admin' : 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }

        try {
          await setDoc(doc(db, 'wallets', user.uid), {
            balance: 0,
            totalDeposit: 0,
            totalWithdraw: 0,
            totalProfit: 0,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `wallets/${user.uid}`);
        }

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ensure admin user has super_admin role in Firestore
        if (user.email === ADMIN_EMAIL) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists() || userDoc.data()?.role !== 'super_admin') {
              await setDoc(userDocRef, {
                uid: user.uid,
                name: 'Super Admin',
                email: user.email,
                role: 'super_admin',
                updatedAt: new Date().toISOString()
              }, { merge: true });
            }
          } catch (err) {
            console.error("Error setting admin role:", err);
          }
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = "Authentication failed.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = "Invalid email or password.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "Email is already in use.";
      } else if (err.message?.includes('Firestore Error')) {
        message = "Database permission error. Please contact support.";
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
      
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', user.uid));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      }

      if (!userDoc?.exists()) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: user.displayName || 'User',
            email: user.email,
            phone: user.phoneNumber || '',
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }

        try {
          await setDoc(doc(db, 'wallets', user.uid), {
            balance: 0,
            totalDeposit: 0,
            totalWithdraw: 0,
            totalProfit: 0,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `wallets/${user.uid}`);
        }
      }
    } catch (err: any) {
      console.error("Social auth error:", err);
      setError(err.message?.includes('Firestore Error') ? "Database permission error." : "Social authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:flex font-sans">
      {/* Left Side: Brand Content (Desktop Only) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Abstract shapes for depth */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg p-10 rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-xl bg-brand-primary/30">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <ShieldCheck className="text-brand-primary" size={40} />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            Invest Smarter.<br />Grow Faster.
          </h2>
          <p className="text-white leading-relaxed font-bold">
            Join Owambe Forex Academy and unlock powerful investment strategies, mentorship programs, and consistent growth opportunities designed for serious traders and investors.
          </p>
          
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-primary bg-gray-900 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm font-black">
              Joined by 5,000+ traders
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px] h-[620px] relative z-10"
        >
          {/* Glassmorphism Card */}
          <div className="w-full h-full flex flex-col bg-white/90 backdrop-blur-xl border border-brand-primary/30 rounded-[20px] shadow-2xl overflow-hidden relative">
            {/* Brand Overlay (rgba(primary, 0.1)) */}
            <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none -z-10"></div>
            
            {/* Fixed Header */}
            <div className="p-6 sm:p-8 pb-4 text-center shrink-0 relative z-20 bg-white/50 backdrop-blur-sm border-b border-gray-100/50">
              <div className="lg:hidden w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/20">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {currentUser && !currentUser.emailVerified ? 'Verify Email' : (mode === 'login' ? 'Welcome Back' : 'Join Owambe')}
              </h1>
              <p className="text-gray-600 text-[11px] mt-1 font-bold">
                {currentUser && !currentUser.emailVerified ? 'Check your inbox for a verification link' : (mode === 'login' ? 'Secure access to your wealth' : 'Start your financial journey today')}
              </p>
            </div>

            {/* Scrollable Container with Fades */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
              {/* Top Fade Indicator */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto auth-scroll px-6 sm:px-8 py-6">
                {needsVerification && !currentUser && (
                  <div className="bg-brand-primary/10 border border-brand-primary/30 text-brand-primary p-3 rounded-xl text-[11px] flex items-center gap-2 font-black mb-4">
                    <ShieldCheck size={14} />
                    <span>Please log in to verify your email.</span>
                  </div>
                )}

                {currentUser && !currentUser.emailVerified && (
                  <div className="bg-brand-primary/10 border border-brand-primary/30 text-brand-primary p-4 rounded-xl text-[11px] flex items-center gap-3 font-black mb-4">
                    <ShieldCheck size={14} />
                    <div className="flex-1">
                      <p>Please verify your email to continue.</p>
                      <div className="flex gap-4 mt-2">
                        <button 
                          onClick={() => sendEmailVerification(currentUser)}
                          className="text-brand-primary underline font-black hover:text-brand-secondary transition-colors"
                        >
                          Resend email
                        </button>
                        <button 
                          onClick={() => signOut(auth)}
                          className="text-gray-600 underline font-black hover:text-gray-900 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(!currentUser || currentUser.emailVerified) ? (
                  <>
                    {/* Social Logins */}
                    <div className="space-y-3 mb-6">
                      <button 
                        onClick={() => handleSocialAuth(googleProvider)}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-black/10 rounded-xl text-gray-900 hover:bg-gray-50 transition-all font-bold text-xs shadow-sm"
                      >
                        <Chrome size={18} className="text-brand-primary" />
                        Continue with Google
                      </button>
                      <button 
                        onClick={() => handleSocialAuth(facebookProvider)}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-black/10 rounded-xl text-gray-900 hover:bg-gray-50 transition-all font-bold text-xs shadow-sm"
                      >
                        <Facebook size={18} className="text-[#1877F2]" />
                        Continue with Facebook
                      </button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-black/10"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                        <span className="bg-white/90 px-3 text-gray-500">Or with Email</span>
                      </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex p-1.5 bg-gray-100 rounded-xl mb-6 border border-black/5">
                      <button 
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2.5 text-[11px] font-black rounded-lg transition-all duration-300 ${mode === 'login' ? 'bg-white text-brand-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => setMode('signup')}
                        className={`flex-1 py-2.5 text-[11px] font-black rounded-lg transition-all duration-300 ${mode === 'signup' ? 'bg-white text-brand-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Sign Up
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.form 
                        key={mode}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleAuth}
                        className="space-y-4"
                      >
                        {mode === 'signup' && (
                          <>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Full Name</label>
                              <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                  type="text" 
                                  required 
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Enter your full name"
                                  className="w-full bg-white border border-black/20 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Phone Number</label>
                              <div className="flex gap-2 relative">
                                <div className="relative" ref={dropdownRef}>
                                  <button
                                    type="button"
                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                    className="h-full px-3 bg-white border border-black/20 rounded-xl flex items-center gap-1.5 hover:bg-gray-50 transition-all min-w-[90px]"
                                  >
                                    <span className="text-lg">{getFlagEmoji(selectedCountry)}</span>
                                    <span className="text-[11px] font-black text-gray-900">+{getCountryCallingCode(selectedCountry)}</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                  </button>

                                  <AnimatePresence>
                                    {showCountryDropdown && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-2 w-[260px] bg-white border border-black/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                      >
                                        <div className="p-2.5 border-b border-gray-100 bg-gray-50">
                                          <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                            <input
                                              type="text"
                                              placeholder="Search countries..."
                                              value={countrySearch}
                                              onChange={(e) => setCountrySearch(e.target.value)}
                                              className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-[11px] outline-none focus:border-brand-primary"
                                            />
                                          </div>
                                        </div>
                                        <div className="max-h-[220px] overflow-y-auto py-1.5">
                                          {filteredCountries.map(c => (
                                            <button
                                              key={c.code}
                                              type="button"
                                              onClick={() => {
                                                setSelectedCountry(c.code as CountryCode);
                                                setShowCountryDropdown(false);
                                                setCountrySearch('');
                                              }}
                                              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                            >
                                              <div className="flex items-center gap-3">
                                                <span className="text-lg">{c.flag}</span>
                                                <span className="text-[11px] font-bold text-gray-900 truncate max-w-[140px]">{c.name}</span>
                                              </div>
                                              <span className="text-[10px] font-black text-gray-400">{c.dialCode}</span>
                                            </button>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                <div className="flex-1 relative group">
                                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                                  <input 
                                    type="tel" 
                                    required 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Local number"
                                    className="w-full bg-white border border-black/20 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input 
                              type="email" 
                              required 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full bg-white border border-black/20 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              required 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-white border border-black/20 rounded-xl py-3 pl-11 pr-11 text-sm text-black placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        {mode === 'signup' && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                              <input 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-black/20 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
                              />
                            </div>
                          </div>
                        )}

                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-error/10 border border-error/20 text-error p-3.5 rounded-xl text-[11px] flex items-center gap-2.5 font-black"
                          >
                            <AlertCircle size={16} />
                            <span>{error}</span>
                          </motion.div>
                        )}

                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-brand-primary/30 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                        >
                          {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : (
                            <>
                              {mode === 'login' ? 'Sign In' : 'Create Account'}
                              <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                      </motion.form>
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="text-brand-primary animate-bounce" size={40} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">Check your email</h3>
                    <p className="text-gray-600 text-sm font-bold px-4 leading-relaxed">
                      We've sent a verification link to <br />
                      <span className="text-brand-primary font-black">{currentUser.email}</span>. 
                      Please activate your account to continue.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Fade Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 pt-2 text-center shrink-0 relative z-20 bg-white/50 backdrop-blur-sm border-t border-gray-100/50">
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold">
                By continuing, you agree to our <br />
                <button className="text-gray-900 font-black hover:underline">Terms of Service</button> and <button className="text-gray-900 font-black hover:underline">Privacy Policy</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
