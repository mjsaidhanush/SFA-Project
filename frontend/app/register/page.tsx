"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Farmer' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                router.push('/dashboard');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            // Default demo fallback
            localStorage.setItem('token', 'demo_token_123');
            localStorage.setItem('user', JSON.stringify({ name: formData.name || "Kisan User", email: formData.email, role: formData.role }));
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
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
                        <Sparkles className="w-3.5 h-3.5 text-cyan" />
                        <span>Kisan Smart Ecosystem</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Create Farmer Account
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Join thousands of smart farmers using AI telemetry</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan bg-slate-50 text-navy-900 placeholder-slate-400 text-xs transition-all outline-none font-medium"
                            placeholder="Ramesh Patel"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan bg-slate-50 text-navy-900 placeholder-slate-400 text-xs transition-all outline-none font-medium"
                            placeholder="ramesh@kisan.in"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">Farmer Profile / Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan bg-slate-50 text-navy-900 text-xs transition-all outline-none font-medium"
                        >
                            <option value="Farmer">Individual Cultivator (Farmer)</option>
                            <option value="FPO">Farmer Producer Organization (FPO)</option>
                            <option value="Agronomist">Agronomist / Consultant</option>
                            <option value="Buyer">Mandi Commodity Buyer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wide">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan bg-slate-50 text-navy-900 placeholder-slate-400 text-xs transition-all outline-none font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-navy-900 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-lg shadow-navy-900/15 hover:shadow-glow-cyan transition-all duration-200 disabled:opacity-70 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-cyan/30 mt-2"
                    >
                        <span>{loading ? 'Creating Farm Profile...' : 'Complete Registration'}</span>
                        <ArrowRight className="w-4 h-4 text-cyan" />
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500 font-medium">
                    Already registered?{' '}
                    <Link href="/" className="font-extrabold text-teal-800 hover:text-cyan transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

