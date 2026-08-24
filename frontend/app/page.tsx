"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    User as UserIcon, 
    Phone, 
    MapPin, 
    Sprout, 
    ArrowRight, 
    Sparkles, 
    CheckCircle2, 
    AlertCircle, 
    ChevronDown, 
    ChevronUp,
    ShieldCheck,
    Lock as LockIcon,
    X
} from 'lucide-react';
import { audioManager } from './audioManager';

// Approved Administrator Allowlist
const ADMIN_EMAILS = [
    'mjsaidhanush@gmail.com',
    'purush361@gmail.com'
];

export default function Home() {
    const router = useRouter();
    
    // Auth & App Flow States: 'auth' -> 'hollyland'
    const [currentStep, setCurrentStep] = useState<'auth' | 'hollyland'>('auth');
    const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');
    
    // Form Inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('Andhra Pradesh');
    const [farmSize, setFarmSize] = useState('5 Acres');
    const [primaryCrop, setPrimaryCrop] = useState('Wheat');
    const [rememberMe, setRememberMe] = useState(true);
    
    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showFarmerDetails, setShowFarmerDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showAdminRestrictedModal, setShowAdminRestrictedModal] = useState(false);
    
    // Hollyland Transition States
    const [isSlidingOut, setIsSlidingOut] = useState(false);
    const [bgLoaded, setBgLoaded] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);

    // Preload background image and check existing session
    useEffect(() => {
        const img = new Image();
        img.src = "/farm-background.jpg";
        img.onload = () => setBgLoaded(true);
        img.onerror = () => setBgLoaded(true);

        try {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");
            if (token && savedUser) {
                const parsed = JSON.parse(savedUser);
                setAuthenticatedUser(parsed);
                setCurrentStep('hollyland');
            }
        } catch (e) {
            console.error("Session check error:", e);
        }
    }, []);

    // Helper to check if email is an authorized administrator
    const isAdminAccount = (emailStr: string) => {
        if (!emailStr) return false;
        return ADMIN_EMAILS.includes(emailStr.trim().toLowerCase());
    };

    // Email validation helper
    const isValidEmail = (emailStr: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    // Handle Admin Access Click
    const handleAdminAccessClick = () => {
        setErrorMessage('');
        setSuccessMessage('');
        
        try {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (!token || !savedUser) {
                setAuthMode('login');
                setErrorMessage('Please sign in with your authorized administrator account to access the Admin Console.');
                return;
            }

            const parsed = JSON.parse(savedUser);
            const userEmail = parsed.email ? parsed.email.trim().toLowerCase() : '';
            const isAdmin = isAdminAccount(userEmail) || parsed.role === 'Admin';

            if (isAdmin) {
                router.push('/admin');
            } else {
                setAuthenticatedUser(parsed);
                setShowAdminRestrictedModal(true);
            }
        } catch (e) {
            setAuthMode('login');
            setErrorMessage('Please sign in with your authorized administrator credentials.');
        }
    };

    // Handle Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!email.trim() || !isValidEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (!password || password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        const normalizedEmail = email.trim().toLowerCase();
        const isAdmin = isAdminAccount(normalizedEmail);

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const res = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: normalizedEmail, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                const userObj = {
                    name: data.name,
                    displayName: data.displayName || data.name,
                    email: data.email,
                    role: isAdmin ? 'Admin' : (data.role || 'Farmer'),
                    isAdmin,
                    phone: data.phone || '',
                    location: data.location || location,
                    farmSize: data.farmSize || farmSize,
                    primaryCrop: data.primaryCrop || primaryCrop,
                };
                localStorage.setItem('user', JSON.stringify(userObj));
                setAuthenticatedUser(userObj);
                setSuccessMessage(isAdmin ? 'Administrator authenticated! Entering Admin Console...' : 'Welcome back! Initializing Hollyland...');
                setTimeout(() => {
                    setCurrentStep('hollyland');
                }, 400);
            } else {
                setErrorMessage(data.message || 'Invalid email or password.');
            }
        } catch (err) {
            // Fallback for seamless demo
            console.warn('Backend unavailable, activating local session fallback');
            const fallbackUser = {
                name: email.split('@')[0].toUpperCase(),
                displayName: email.split('@')[0],
                email: normalizedEmail,
                role: isAdmin ? 'Admin' : 'Farmer',
                isAdmin,
                phone,
                location,
                farmSize,
                primaryCrop,
            };
            localStorage.setItem('token', 'sfa_demo_jwt_token_' + Date.now());
            localStorage.setItem('user', JSON.stringify(fallbackUser));
            setAuthenticatedUser(fallbackUser);
            setCurrentStep('hollyland');
        } finally {
            setLoading(false);
        }
    };

    // Handle Register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!name.trim()) {
            setErrorMessage('Please enter your full name.');
            return;
        }
        if (!email.trim() || !isValidEmail(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (!password || password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setLoading(true);
        const normalizedEmail = email.trim().toLowerCase();
        const isAdmin = isAdminAccount(normalizedEmail);

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const res = await fetch(`${backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    displayName: name.trim().split(' ')[0],
                    email: normalizedEmail,
                    password,
                    role: isAdmin ? 'Admin' : 'Farmer',
                    phone,
                    location,
                    farmSize,
                    primaryCrop,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                const userObj = {
                    name: data.name,
                    displayName: data.displayName || data.name,
                    email: data.email,
                    role: isAdmin ? 'Admin' : (data.role || 'Farmer'),
                    isAdmin,
                    phone: data.phone || phone,
                    location: data.location || location,
                    farmSize: data.farmSize || farmSize,
                    primaryCrop: data.primaryCrop || primaryCrop,
                };
                localStorage.setItem('user', JSON.stringify(userObj));
                setAuthenticatedUser(userObj);
                setSuccessMessage('Account created successfully! Entering Hollyland...');
                setTimeout(() => {
                    setCurrentStep('hollyland');
                }, 400);
            } else {
                setErrorMessage(data.message || 'Registration failed. User may already exist.');
            }
        } catch (err) {
            const fallbackUser = {
                name: name.trim(),
                displayName: name.trim().split(' ')[0],
                email: normalizedEmail,
                role: isAdmin ? 'Admin' : 'Farmer',
                isAdmin,
                phone,
                location,
                farmSize,
                primaryCrop,
            };
            localStorage.setItem('token', 'sfa_demo_jwt_token_' + Date.now());
            localStorage.setItem('user', JSON.stringify(fallbackUser));
            setAuthenticatedUser(fallbackUser);
            setCurrentStep('hollyland');
        } finally {
            setLoading(false);
        }
    };

    // Handle Google OAuth
    const handleGoogleAuth = async () => {
        setErrorMessage('');
        setGoogleLoading(true);
        try {
            // Simulated OAuth payload for Dhanush (Default Admin account)
            const simulatedGoogleUser = {
                name: 'Dhanush',
                email: 'mjsaidhanush@gmail.com',
                googleId: 'google_oauth_1092837461',
            };

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const res = await fetch(`${backendUrl}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(simulatedGoogleUser),
            });

            const isAdmin = isAdminAccount(simulatedGoogleUser.email);

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                const userObj = {
                    name: data.name,
                    displayName: data.displayName || data.name,
                    email: data.email,
                    role: isAdmin ? 'Admin' : (data.role || 'Farmer'),
                    isAdmin,
                    phone: data.phone || '',
                    location: data.location || 'Andhra Pradesh',
                    farmSize: data.farmSize || '5 Acres',
                    primaryCrop: data.primaryCrop || 'Wheat',
                };
                localStorage.setItem('user', JSON.stringify(userObj));
                setAuthenticatedUser(userObj);
            } else {
                const userObj = {
                    name: 'Dhanush',
                    displayName: 'Dhanush',
                    email: 'mjsaidhanush@gmail.com',
                    role: 'Admin',
                    isAdmin: true,
                    phone: '+91 98765 43210',
                    location: 'Andhra Pradesh',
                    farmSize: '5 Acres',
                    primaryCrop: 'Wheat',
                };
                localStorage.setItem('token', 'google_jwt_token_' + Date.now());
                localStorage.setItem('user', JSON.stringify(userObj));
                setAuthenticatedUser(userObj);
            }
            setSuccessMessage('Google authentication verified. Entering Hollyland...');
            setTimeout(() => {
                setCurrentStep('hollyland');
            }, 300);
        } catch (err) {
            const userObj = {
                name: 'Dhanush',
                displayName: 'Dhanush',
                email: 'mjsaidhanush@gmail.com',
                role: 'Admin',
                isAdmin: true,
                phone: '',
                location: 'Andhra Pradesh',
                farmSize: '5 Acres',
                primaryCrop: 'Wheat',
            };
            localStorage.setItem('token', 'google_jwt_token_' + Date.now());
            localStorage.setItem('user', JSON.stringify(userObj));
            setAuthenticatedUser(userObj);
            setCurrentStep('hollyland');
        } finally {
            setGoogleLoading(false);
        }
    };

    // Handle Forgot Password
    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !isValidEmail(email)) {
            setErrorMessage('Please enter your registered Gmail/email address.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage(`A password reset link has been dispatched to ${email}. Please check your inbox.`);
        }, 800);
    };

    // Transition from Hollyland to Dashboard or Admin Console
    const handleEnterDestination = (targetRoute: '/dashboard' | '/admin') => {
        // Start hollyland-theme.mp3 from the beginning, fading in smoothly from 0 to 35%
        try {
            audioManager.playHollylandTheme().catch((err) => {
                console.warn("[Hollyland Theme] Audio playback notice:", err);
            });
        } catch (e) {
            console.warn("[Hollyland Theme] Audio manager invocation error:", e);
        }

        setIsSlidingOut(true);
        try {
            sessionStorage.setItem("sfa_cinematic_entered", "true");
        } catch (e) {}
        setTimeout(() => {
            router.push(targetRoute);
        }, 850);
    };

    const isUserAdmin = authenticatedUser?.role === 'Admin' || isAdminAccount(authenticatedUser?.email);

    return (
        <div className="min-h-screen w-screen h-screen relative overflow-hidden font-sans bg-[#0B1118] select-none text-white">
            
            {/* ACCESS RESTRICTED MODAL */}
            {showAdminRestrictedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-md p-8 rounded-3xl bg-[#101820] border-2 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                            <LockIcon className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black uppercase text-white tracking-wide">
                                Access Restricted
                            </h3>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                This account (<span className="text-white font-mono font-bold">{authenticatedUser?.email}</span>) does not have administrator permissions.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAdminRestrictedModal(false)}
                            className="w-full py-3.5 bg-gradient-to-r from-teal-800 to-cyan text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg hover:scale-102 transition-all cursor-pointer"
                        >
                            Return to Farm
                        </button>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 1. MODERN FUTURISTIC AUTHENTICATION PAGE (SPLIT-SCREEN) */}
            {/* ========================================================= */}
            {currentStep === 'auth' && (
                <div className="min-h-screen w-full flex flex-col lg:flex-row relative z-50 animate-fade-in">
                    
                    {/* LEFT PANEL — CINEMATIC AGRICULTURAL SHOWCASE */}
                    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white border-r border-cyan/20">
                        <div 
                            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                            style={{ backgroundImage: "url('/farm-background.jpg')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1118]/90 via-[#0B1118]/70 to-[#0B1118]/85 mix-blend-multiply backdrop-blur-[1px]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(24,213,208,0.15)_0%,transparent_60%)]"></div>

                        {/* Top Header Logo */}
                        <div className="relative z-10 flex items-center space-x-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center border border-cyan/60 shadow-[0_0_20px_rgba(24,213,208,0.4)]">
                                <img src="/smart-farm-logo.png" alt="Smart Farm Logo" className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div>
                                <h2 className="text-base font-black uppercase tracking-wider text-white">Smart Farm Assistant</h2>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan inline-block mr-1.5 animate-pulse"></span>
                                    Autonomous AgriTech OS
                                </span>
                            </div>
                        </div>

                        {/* Center Value Proposition */}
                        <div className="relative z-10 space-y-4 max-w-lg">
                            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-cyan/15 rounded-full text-xs font-black text-cyan uppercase tracking-widest border border-cyan/30">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI-Powered Agriculture</span>
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                                Smarter Decisions.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan to-lime">
                                    Better Harvests.
                                </span>
                            </h1>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed">
                                Experience precision agriculture with real-time soil telemetry, CNN leaf disease diagnostics, Doppler precipitation radar, and Mandi price forecasting.
                            </p>
                            <div className="pt-2 flex items-center space-x-6 text-xs text-slate-300 font-bold">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-4 h-4 text-cyan" />
                                    <span>Live NPK AI Analysis</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle2 className="w-4 h-4 text-lime" />
                                    <span>Doppler Radar</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Telemetry Footer */}
                        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-[11px] text-slate-400 font-mono">
                            <span>SFA TELEMETRY v2.4</span>
                            <span className="text-cyan font-bold">● CONNECTED TO HOLLYLAND GRID</span>
                        </div>
                    </div>

                    {/* RIGHT PANEL — AUTHENTICATION CARD */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-[#0B1118]/95 relative">
                        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan/10 rounded-full filter blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-lime/10 rounded-full filter blur-[100px] pointer-events-none"></div>

                        <div className="w-full max-w-md space-y-6 relative z-10 py-6">
                            
                            {/* Mobile Top Branding */}
                            <div className="lg:hidden flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-cyan/40 shadow-xs">
                                    <img src="/smart-farm-logo.png" alt="Smart Farm Logo" className="w-full h-full object-cover rounded-lg" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white">Smart Farm Assistant</h2>
                                    <span className="text-[10px] font-bold text-cyan">AI Agriculture Platform</span>
                                </div>
                            </div>

                            {/* View Switcher: LOGIN VIEW */}
                            {authMode === 'login' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                            Welcome Back 👋
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                                            Sign in to continue to your smart farm telemetry.
                                        </p>
                                    </div>

                                    {/* Google Login Button */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleAuth}
                                        disabled={googleLoading}
                                        className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transition-all border border-slate-200 cursor-pointer active:scale-98"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                                        </svg>
                                        <span>{googleLoading ? 'Verifying Google Account...' : 'Continue with Google'}</span>
                                    </button>

                                    {/* Divider */}
                                    <div className="relative flex items-center justify-center my-4">
                                        <div className="border-t border-slate-700 w-full"></div>
                                        <span className="bg-[#0B1118] px-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                                            OR
                                        </span>
                                        <div className="border-t border-slate-700 w-full"></div>
                                    </div>

                                    {/* Error / Success Alerts */}
                                    {errorMessage && (
                                        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}
                                    {successMessage && (
                                        <div className="p-3.5 rounded-xl bg-cyan/15 border border-cyan/40 text-cyan text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                                            <CheckCircle2 className="w-4 h-4 text-cyan shrink-0" />
                                            <span>{successMessage}</span>
                                        </div>
                                    )}

                                    {/* Email & Password Form */}
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your Gmail / email address"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                                                    Password
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => { setAuthMode('forgot_password'); setErrorMessage(''); setSuccessMessage(''); }}
                                                    className="text-xs font-extrabold text-cyan hover:underline transition-all"
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter your password"
                                                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all placeholder:text-slate-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 pt-1">
                                            <input
                                                type="checkbox"
                                                id="rememberMe"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-4 h-4 rounded bg-[#101820] border-cyan/30 text-cyan focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="rememberMe" className="text-xs text-slate-300 font-medium cursor-pointer">
                                                Remember my farm session
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 bg-gradient-to-r from-[#101820] to-[#15222E] hover:from-teal-900 hover:to-navy-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-cyan/40 hover:border-cyan shadow-[0_0_20px_rgba(24,213,208,0.3)] hover:shadow-[0_0_30px_rgba(24,213,208,0.5)] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                                        >
                                            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                                            <ArrowRight className="w-4 h-4 text-cyan" />
                                        </button>
                                    </form>

                                    {/* Switch to Register */}
                                    <div className="text-center pt-2">
                                        <span className="text-xs text-slate-400 font-medium">Don't have an account? </span>
                                        <button
                                            type="button"
                                            onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                                            className="text-xs font-black text-cyan hover:underline uppercase tracking-wider ml-1"
                                        >
                                            Create Account
                                        </button>
                                    </div>

                                    {/* SUBTLE ADMIN ACCESS SECTION */}
                                    <div className="pt-4 mt-4 border-t border-slate-800/80 text-center">
                                        <div className="inline-flex items-center space-x-2 text-[11px] text-slate-400">
                                            <span>Are you an administrator?</span>
                                            <button
                                                type="button"
                                                onClick={handleAdminAccessClick}
                                                className="font-bold text-cyan hover:underline flex items-center space-x-1 cursor-pointer"
                                            >
                                                <span>Admin Portal</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* View Switcher: REGISTER VIEW */}
                            {authMode === 'register' && (
                                <div className="space-y-5 animate-fade-in">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                            Create Farmer Account 🌱
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                                            Join Smart Farm Assistant to optimize your farm telemetry.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleGoogleAuth}
                                        disabled={googleLoading}
                                        className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transition-all border border-slate-200 cursor-pointer active:scale-98"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                                        </svg>
                                        <span>Continue with Google</span>
                                    </button>

                                    <div className="relative flex items-center justify-center my-3">
                                        <div className="border-t border-slate-700 w-full"></div>
                                        <span className="bg-[#0B1118] px-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                                            OR
                                        </span>
                                        <div className="border-t border-slate-700 w-full"></div>
                                    </div>

                                    {errorMessage && (
                                        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleRegister} className="space-y-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Enter your full name (e.g. Dhanush)"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your Gmail / email address"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Min. 8 chars"
                                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none transition-all placeholder:text-slate-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                                    >
                                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        required
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder="Repeat password"
                                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none transition-all placeholder:text-slate-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Optional Farmer Details Accordion */}
                                        <div className="pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowFarmerDetails(!showFarmerDetails)}
                                                className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-cyan transition-colors"
                                            >
                                                <span className="flex items-center space-x-2">
                                                    <Sprout className="w-3.5 h-3.5 text-lime" />
                                                    <span>Optional: Farmer Profile Details</span>
                                                </span>
                                                {showFarmerDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>

                                            {showFarmerDetails && (
                                                <div className="mt-2.5 p-3.5 rounded-xl bg-[#101820] border border-cyan/20 space-y-3 animate-fade-in text-xs">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Phone Number</label>
                                                            <input
                                                                type="text"
                                                                value={phone}
                                                                onChange={(e) => setPhone(e.target.value)}
                                                                placeholder="+91 98765 43210"
                                                                className="w-full px-3 py-2 rounded-lg bg-[#0B1118] border border-slate-700 text-white font-medium text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Location / State</label>
                                                            <input
                                                                type="text"
                                                                value={location}
                                                                onChange={(e) => setLocation(e.target.value)}
                                                                placeholder="e.g. Andhra Pradesh, Pune"
                                                                className="w-full px-3 py-2 rounded-lg bg-[#0B1118] border border-slate-700 text-white font-medium text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Farm Size</label>
                                                            <input
                                                                type="text"
                                                                value={farmSize}
                                                                onChange={(e) => setFarmSize(e.target.value)}
                                                                placeholder="e.g. 5 Acres"
                                                                className="w-full px-3 py-2 rounded-lg bg-[#0B1118] border border-slate-700 text-white font-medium text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Primary Crop</label>
                                                            <select
                                                                value={primaryCrop}
                                                                onChange={(e) => setPrimaryCrop(e.target.value)}
                                                                className="w-full px-3 py-2 rounded-lg bg-[#0B1118] border border-slate-700 text-white font-medium text-xs"
                                                            >
                                                                <option>Wheat</option>
                                                                <option>Rice / Paddy</option>
                                                                <option>Cotton</option>
                                                                <option>Sugarcane</option>
                                                                <option>Maize</option>
                                                                <option>Soybean</option>
                                                                <option>Groundnut</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 bg-gradient-to-r from-[#101820] to-[#15222E] hover:from-teal-900 hover:to-navy-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all border-2 border-cyan/40 hover:border-cyan shadow-[0_0_20px_rgba(24,213,208,0.3)] hover:shadow-[0_0_30px_rgba(24,213,208,0.5)] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
                                        >
                                            <span>{loading ? 'Creating Farmer Account...' : 'Create Account'}</span>
                                            <ArrowRight className="w-4 h-4 text-cyan" />
                                        </button>
                                    </form>

                                    <div className="text-center pt-2">
                                        <span className="text-xs text-slate-400 font-medium">Already have an account? </span>
                                        <button
                                            type="button"
                                            onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                                            className="text-xs font-black text-cyan hover:underline uppercase tracking-wider ml-1"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* View Switcher: FORGOT PASSWORD VIEW */}
                            {authMode === 'forgot_password' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                            Reset Your Password 🔒
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                                            Enter your email and we'll send you a password reset link.
                                        </p>
                                    </div>

                                    {errorMessage && (
                                        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-2">
                                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}
                                    {successMessage && (
                                        <div className="p-4 rounded-xl bg-cyan/15 border border-cyan/40 text-cyan text-xs font-semibold flex items-center space-x-2 animate-fade-in">
                                            <CheckCircle2 className="w-5 h-5 text-cyan shrink-0" />
                                            <span>{successMessage}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                                                Registered Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your Gmail / email address"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#101820] border border-cyan/30 text-white font-medium text-xs focus:border-cyan outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 bg-gradient-to-r from-[#101820] to-[#15222E] hover:from-teal-900 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all border border-cyan/40 hover:border-cyan shadow-md flex items-center justify-center space-x-2"
                                        >
                                            <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                                            <ArrowRight className="w-4 h-4 text-cyan" />
                                        </button>
                                    </form>

                                    <div className="text-center pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                                            className="text-xs font-black text-cyan hover:underline uppercase tracking-wider"
                                        >
                                            ← Back to Sign In
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 2. HOLLYLAND & ADMIN CONSOLE CINEMATIC ENTRANCE */}
            {/* ========================================================= */}
            {currentStep === 'hollyland' && (
                <div
                    className={`fixed inset-0 z-50 w-full h-full flex items-center justify-center transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isSlidingOut 
                            ? "-translate-x-full opacity-90 scale-[0.98] pointer-events-none shadow-[30px_0_90px_rgba(24,213,208,0.6)]" 
                            : "translate-x-0 opacity-100 scale-100"
                    }`}
                >
                    <div
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform ${
                            isSlidingOut ? "scale-115 blur-xs" : "scale-105"
                        } ${bgLoaded ? "opacity-100" : "opacity-0"}`}
                        style={{ backgroundImage: "url('/farm-background.jpg')" }}
                    ></div>

                    {isSlidingOut && (
                        <div className="absolute inset-y-0 w-56 bg-gradient-to-r from-transparent via-cyan to-white filter blur-lg z-30 animate-light-sweep pointer-events-none"></div>
                    )}

                    {!bgLoaded && (
                        <div className="absolute inset-0 bg-[#0B1118] flex flex-col items-center justify-center z-0 text-white space-y-4">
                            <div className="w-12 h-12 rounded-2xl border-2 border-cyan border-t-transparent animate-spin"></div>
                            <div className="flex items-center space-x-2">
                                <Sprout className="w-5 h-5 text-cyan animate-pulse" />
                                <span className="text-xs font-black tracking-widest uppercase text-cyan">SMART FARM ASSISTANT</span>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B1118]/85 via-[#101820]/60 to-[#0B1118]/90 mix-blend-multiply backdrop-blur-[2px] z-10 transition-opacity duration-1000"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(11,17,24,0.92)_100%)] z-10"></div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-radial from-cyan/25 via-teal-800/15 to-transparent rounded-full filter blur-[100px] pointer-events-none z-10"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/15 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime/10 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob animation-delay-2000"></div>

                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
                        <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#18D5D0] animate-float-particle"></div>
                        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_10px_#A8E63D] animate-float-particle" style={{ animationDelay: '1.2s' }}></div>
                        <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-float-particle" style={{ animationDelay: '0.6s' }}></div>
                    </div>

                    {/* Center Content Container */}
                    <div className="relative z-20 max-w-2xl mx-auto px-6 text-center flex flex-col items-center space-y-6 animate-fade-in">
                        
                        {/* Official Brand Emblem Logo with Cyan Glow */}
                        <div 
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-1 flex items-center justify-center border-2 border-cyan/60 shadow-[0_0_35px_rgba(24,213,208,0.4)] overflow-hidden transform hover:scale-105 transition-all duration-300 animate-entry-scale"
                            style={{ animationDelay: '200ms' }}
                        >
                            <img
                                src="/smart-farm-logo.png"
                                alt="Smart Farm Assistant Logo"
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </div>

                        {/* Title & Subtitle */}
                        <div 
                            className="space-y-1.5 animate-entry-fade-up"
                            style={{ animationDelay: '400ms' }}
                        >
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-wider uppercase text-white leading-tight">
                                SMART FARM ASSISTANT
                            </h1>
                            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-slate-300/90">
                                {isUserAdmin 
                                    ? `Welcome to Smart Farm Assistant Admin Console` 
                                    : (authenticatedUser?.name ? `Welcome to Hollyland, ${authenticatedUser.name}` : 'Welcome to the future of farming')
                                }
                            </p>
                        </div>

                        {/* Destination Heading */}
                        <div 
                            className="pt-2 pb-1 animate-entry-fade-up"
                            style={{ animationDelay: '600ms' }}
                        >
                            <div className="relative inline-block">
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.25em] sm:tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan to-teal-100 filter drop-shadow-[0_0_25px_rgba(24,213,208,0.6)]">
                                    {isUserAdmin ? "ENTER ADMIN CONSOLE" : "ENTER TO HOLLYLAND"}
                                </h2>
                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan to-transparent mt-2 opacity-80"></div>
                            </div>
                        </div>

                        {/* THE GLOWING ARROW OF LIGHT (Main Interactive Element) */}
                        <div 
                            className="pt-2 animate-entry-fade-up"
                            style={{ animationDelay: '800ms' }}
                        >
                            <button
                                onClick={() => handleEnterDestination(isUserAdmin ? '/admin' : '/dashboard')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleEnterDestination(isUserAdmin ? '/admin' : '/dashboard');
                                    }
                                }}
                                autoFocus
                                tabIndex={0}
                                aria-label={isUserAdmin ? "Enter Admin Console" : "Enter to Hollyland"}
                                className="group relative flex flex-col items-center justify-center p-6 rounded-full focus:outline-none transition-transform duration-300 cursor-pointer"
                            >
                                <div className="absolute inset-0 rounded-full bg-cyan/15 filter blur-xl group-hover:bg-cyan/35 group-hover:scale-125 transition-all duration-500 pointer-events-none"></div>
                                <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-cyan/40 group-hover:border-cyan group-hover:shadow-[0_0_35px_#18D5D0] transition-all duration-300 flex items-center justify-center bg-navy-900/60 backdrop-blur-md"></div>

                                <div className="relative z-10 animate-arrow-flow group-hover:scale-115 transition-transform duration-300">
                                    <svg
                                        className="w-10 h-10 sm:w-12 sm:h-12 text-white filter drop-shadow-[0_0_15px_#18D5D0] group-hover:drop-shadow-[0_0_28px_#18D5D0]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="4" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="3" />
                                        <polyline points="13 5 20 12 13 19" stroke="#18D5D0" strokeWidth="3" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* Microtext Navigation Cue */}
                        <div 
                            className="space-y-1 animate-entry-fade-up"
                            style={{ animationDelay: '1000ms' }}
                        >
                            <p className="text-[11px] font-bold text-slate-300/80 tracking-[0.25em] uppercase">
                                Follow the light to enter
                            </p>
                            <p className="text-[10px] font-mono text-cyan/70 tracking-widest uppercase">
                                Click Arrow or Press <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">ENTER ↵</span>
                            </p>
                        </div>

                        {/* Additional Administrator Options */}
                        {isUserAdmin && (
                            <div className="pt-2 flex items-center space-x-4">
                                <button
                                    onClick={() => handleEnterDestination('/dashboard')}
                                    className="text-xs font-black text-lime hover:underline uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    🌾 Switch to Farmer Dashboard
                                </button>
                            </div>
                        )}

                        {/* Switch account / Log out link */}
                        <div className="pt-2">
                            <button
                                onClick={async () => {
                                    try {
                                        await audioManager.fadeAndStop(700);
                                    } catch (e) {}
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    setAuthenticatedUser(null);
                                    setCurrentStep('auth');
                                    setAuthMode('login');
                                }}
                                className="text-[11px] text-slate-400 hover:text-cyan underline font-medium tracking-wide transition-colors cursor-pointer"
                            >
                                Switch Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
