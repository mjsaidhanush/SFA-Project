"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Farmer' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
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
            alert('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
            {/* Dark background dynamic blob */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>

            <div className="max-w-md w-full relative z-10 backdrop-blur-2xl bg-gray-900/60 p-8 rounded-3xl shadow-2xl border border-gray-800">
                <div className="text-center mb-10">
                    <Link href="/">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tracking-tight cursor-pointer">
                            Join Smart Farm 🌾
                        </h1>
                    </Link>
                    <p className="text-gray-400 mt-2 font-medium">Create your account</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-gray-900/50 text-white placeholder-gray-500 transition-all outline-none"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-gray-900/50 text-white placeholder-gray-500 transition-all outline-none"
                            placeholder="farmer@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-gray-900/50 text-white transition-all outline-none appearance-none"
                        >
                            <option value="Farmer" className="bg-gray-900">Farmer</option>
                            <option value="Buyer" className="bg-gray-900">Buyer</option>
                            <option value="Admin" className="bg-gray-900">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-gray-900/50 text-white placeholder-gray-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-green-500 hover:text-green-400 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
