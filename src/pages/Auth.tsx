import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ReCAPTCHA from 'react-google-recaptcha';
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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const from = (location.state as any)?.from?.pathname || "/overview";
  const needsVerification = (location.state as any)?.needsVerification || false;

  useEffect(() => {
    if (currentUser && !loading && userData) {
      if (currentUser.isAnonymous) {
        signOut(auth);
        return;
      }

      if (!currentUser.emailVerified) {
        // Stay on auth page to show verification message
        return;
      }

      if (userData.role === 'super_admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentUser && currentUser.emailVerified && userData) {
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
      if (!captchaToken) return setError("Please complete the CAPTCHA");
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

      } else {
        await signInWithEmailAndPassword(auth, email, password);
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
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
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
        className="hidden lg:flex lg:w-1/2 bg-brand-primary items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Abstract shapes for depth */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg glass-dark p-10 rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <ShieldCheck className="text-brand-primary" size={40} />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            Invest Smarter.<br />Grow Faster.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed font-medium">
            Join Owambe Forex Academy and unlock powerful investment strategies, mentorship programs, and consistent growth opportunities designed for serious traders and investors.
          </p>
          
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-primary bg-bg-secondary overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm font-bold">
              Joined by 5,000+ traders
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[380px] my-auto"
        >
          <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="lg:hidden w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/20">
                <ShieldCheck className="text-bg-primary" size={24} />
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                {currentUser && !currentUser.emailVerified ? 'Verify Email' : (mode === 'login' ? 'Welcome Back' : 'Join Owambe')}
              </h1>
              <p className="text-gray-500 text-xs mt-1 font-medium">
                {currentUser && !currentUser.emailVerified ? 'Check your inbox for a verification link' : (mode === 'login' ? 'Secure access to your wealth' : 'Start your financial journey today')}
              </p>
            </div>

            {needsVerification && !currentUser && (
              <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary p-3 rounded-xl text-[10px] flex items-center gap-2 font-bold mb-4">
                <ShieldCheck size={14} />
                <span>Please log in to verify your email.</span>
              </div>
            )}

            {currentUser && !currentUser.emailVerified && (
              <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary p-4 rounded-xl text-[10px] flex items-center gap-3 font-bold mb-4">
                <ShieldCheck size={14} />
                <div className="flex-1">
                  <p>Please verify your email to continue.</p>
                  <div className="flex gap-4 mt-2">
                    <button 
                      onClick={() => sendEmailVerification(currentUser)}
                      className="text-brand-primary underline font-black"
                    >
                      Resend email
                    </button>
                    <button 
                      onClick={() => signOut(auth)}
                      className="text-gray-400 underline font-black"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(!currentUser || currentUser.emailVerified) ? (
              <>
                {/* Social Logins - Moved ABOVE */}
                <div className="space-y-2.5 mb-6">
                  <button 
                    onClick={() => handleSocialAuth(googleProvider)}
                    className="w-full flex items-center justify-center gap-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-bold text-xs"
                  >
                    <Chrome size={16} className="text-brand-primary" />
                    Continue with Google
                  </button>
                  <button 
                    onClick={() => handleSocialAuth(facebookProvider)}
                    className="w-full flex items-center justify-center gap-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-bold text-xs"
                  >
                    <Facebook size={16} className="text-[#1877F2]" />
                    Continue with Facebook
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-black">
                    <span className="bg-white px-3 text-gray-400">Or with Email</span>
                  </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex p-1 bg-gray-50 rounded-xl mb-6 border border-gray-100">
                  <button 
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all duration-300 ${mode === 'login' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all duration-300 ${mode === 'signup' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
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
                    className="space-y-3.5"
                  >
                    {mode === 'signup' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="relative group">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" size={16} />
                            <input 
                              type="text" 
                              required 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-900 focus:border-brand-primary focus:bg-white outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <div className="flex gap-2 relative">
                            <div className="relative" ref={dropdownRef}>
                              <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="h-full px-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-1.5 hover:bg-gray-100 transition-all min-w-[85px]"
                              >
                                <span className="text-base">{getFlagEmoji(selectedCountry)}</span>
                                <span className="text-[10px] font-bold text-gray-700">+{getCountryCallingCode(selectedCountry)}</span>
                                <ChevronDown size={12} className="text-gray-300" />
                              </button>

                              <AnimatePresence>
                                {showCountryDropdown && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-2 w-[240px] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
                                  >
                                    <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                                      <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                                        <input
                                          type="text"
                                          placeholder="Search..."
                                          value={countrySearch}
                                          onChange={(e) => setCountrySearch(e.target.value)}
                                          className="w-full bg-white border border-gray-100 rounded-lg py-1.5 pl-8 pr-2 text-[10px] outline-none focus:border-brand-primary"
                                        />
                                      </div>
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto py-1">
                                      {filteredCountries.map(c => (
                                        <button
                                          key={c.code}
                                          type="button"
                                          onClick={() => {
                                            setSelectedCountry(c.code as CountryCode);
                                            setShowCountryDropdown(false);
                                            setCountrySearch('');
                                          }}
                                          className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="text-base">{c.flag}</span>
                                            <span className="text-[10px] font-medium text-gray-700 truncate max-w-[120px]">{c.name}</span>
                                          </div>
                                          <span className="text-[9px] font-bold text-gray-400">{c.dialCode}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div className="flex-1 relative group">
                              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" size={16} />
                              <input 
                                type="tel" 
                                required 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                placeholder="Local number"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-900 focus:border-brand-primary focus:bg-white outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" size={16} />
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-900 focus:border-brand-primary focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" size={16} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-10 text-xs text-gray-900 focus:border-brand-primary focus:bg-white outline-none transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {mode === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-primary transition-colors" size={16} />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-900 focus:border-brand-primary focus:bg-white outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {mode === 'signup' && (
                      <div className="flex justify-center py-1">
                        <div className="scale-[0.8] origin-center">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                            onChange={(token) => setCaptchaToken(token)}
                            theme="light"
                          />
                        </div>
                      </div>
                    )}

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-error/5 border border-error/10 text-error p-3 rounded-xl text-[10px] flex items-center gap-2 font-bold"
                      >
                        <AlertCircle size={14} />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-brand-primary text-bg-primary rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all mt-2"
                    >
                      {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : (
                        <>
                          {mode === 'login' ? 'Sign In' : 'Create Account'}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </motion.form>
                </AnimatePresence>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-brand-primary animate-bounce" size={32} />
                </div>
                <p className="text-gray-500 text-xs font-medium px-2">
                  We've sent a verification link to <span className="text-gray-900 font-bold">{currentUser.email}</span>. 
                  Check your inbox to activate your account.
                </p>
              </div>
            )}

            <p className="mt-6 text-center text-[9px] text-gray-400 leading-relaxed font-medium">
              By continuing, you agree to our <br />
              <button className="text-gray-900 font-bold hover:underline">Terms of Service</button> and <button className="text-gray-900 font-bold hover:underline">Privacy Policy</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
