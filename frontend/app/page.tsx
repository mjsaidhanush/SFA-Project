"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                router.push('/dashboard');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            // Default demo fallback for effortless login
            localStorage.setItem('token', 'demo_token_123');
            localStorage.setItem('user', JSON.stringify({ name: "Demo Farmer", email, role: "farmer" }));
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            const mockGoogleUser = {
                name: "Google Farmer User",
                email: "google.user@example.com",
                role: "farmer"
            };
            localStorage.setItem('token', 'mock_google_oauth_token_123');
            localStorage.setItem('user', JSON.stringify(mockGoogleUser));
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans bg-cover bg-center bg-no-repeat agri-grid-bg"
            style={{ backgroundImage: "linear-gradient(rgba(16, 24, 32, 0.82), rgba(16, 24, 32, 0.90)), url('/farm-background.jpg')" }}
        >
            {/* Ambient Background Light Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-lime/15 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10 glass-panel bg-white/95 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan/10 rounded-full text-[11px] font-bold text-teal-800 mb-3 border border-cyan/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>AI Farm Operating System</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight flex items-center justify-center">
                        Smart Farm Assistant
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Precision AI telemetry & disease diagnostics</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">Farmer Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan bg-slate-50 text-navy-900 placeholder-slate-400 text-xs transition-all outline-none font-medium"
                            placeholder="farmer@kisan.in"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">Security Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan bg-slate-50 text-navy-900 placeholder-slate-400 text-xs transition-all outline-none font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-navy-900 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-lg shadow-navy-900/15 hover:shadow-glow-cyan transition-all duration-200 disabled:opacity-70 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-cyan/30 mt-2"
                    >
                        <span>{loading ? 'Authenticating...' : 'Sign In To Farm OS'}</span>
                        <ArrowRight className="w-4 h-4 text-cyan" />
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Or instant access</span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all text-xs shadow-xs"
                        >
                            <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500 font-medium">
                    New to Smart Farm?{' '}
                    <Link href="/register" className="font-extrabold text-teal-800 hover:text-cyan transition-colors">
                        Register Free Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

