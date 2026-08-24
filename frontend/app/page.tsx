"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, LogIn } from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const [isSlidingOut, setIsSlidingOut] = useState(false);
    const [bgLoaded, setBgLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = "/farm-background.jpg";
        img.onload = () => setBgLoaded(true);
        img.onerror = () => setBgLoaded(true);
    }, []);

    const handleEnterFarm = () => {
        setIsSlidingOut(true);
        try {
            sessionStorage.setItem("sfa_cinematic_entered", "true");
        } catch (e) {}
        setTimeout(() => {
            router.push('/dashboard');
        }, 850);
    };

    return (
        <div className="min-h-screen w-screen h-screen relative overflow-hidden font-sans bg-navy-900 select-none">
            {/* Cinematic Landing Container with Slide Transition */}
            <div
                className={`fixed inset-0 z-50 w-full h-full flex items-center justify-center transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isSlidingOut 
                        ? "-translate-x-full opacity-90 scale-[0.98] pointer-events-none shadow-[30px_0_90px_rgba(24,213,208,0.5)]" 
                        : "translate-x-0 opacity-100 scale-100"
                }`}
            >
                {/* High-Resolution Cinematic Agricultural Background Image */}
                <div
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 transform scale-105 ${
                        bgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ backgroundImage: "url('/farm-background.jpg')" }}
                ></div>

                {/* Loading Fallback */}
                {!bgLoaded && (
                    <div className="absolute inset-0 bg-navy-900 flex flex-col items-center justify-center z-0 text-white space-y-3">
                        <div className="w-12 h-12 rounded-2xl border-2 border-cyan border-t-transparent animate-spin"></div>
                        <span className="text-xs font-black tracking-widest uppercase text-cyan">Loading Farm Telemetry...</span>
                    </div>
                )}

                {/* Dark Cinematic Gradient Overlay & Soft Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900/85 via-navy-900/60 to-navy-900/90 mix-blend-multiply backdrop-blur-[2px] z-10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(16,24,32,0.85)_100%)] z-10"></div>

                {/* Ambient Glowing Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/20 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime/15 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob animation-delay-2000"></div>

                {/* Center Content */}
                <div className="relative z-20 max-w-2xl mx-auto px-6 text-center flex flex-col items-center space-y-6">
                    
                    {/* Status Pill */}
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-wider uppercase shadow-xl animate-fade-in">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan"></span>
                        </span>
                        <span className="text-cyan">Autonomous Agriculture OS</span>
                        <span className="text-white/40">|</span>
                        <span className="text-white/80 font-mono text-[10px]">v2.4 Live</span>
                    </div>

                    {/* Official Brand Emblem Logo */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1 flex items-center justify-center border-2 border-cyan/60 shadow-2xl shadow-cyan/30 overflow-hidden transform hover:scale-105 transition-all duration-300 animate-fade-in">
                        <img
                            src="/smart-farm-logo.png"
                            alt="Smart Farm Assistant Logo"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>

                    {/* Brand Title */}
                    <div className="space-y-2 animate-fade-in">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                            🌱 SMART FARM <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-teal-300 to-lime">
                                ASSISTANT
                            </span>
                        </h1>
                        <p className="text-base sm:text-2xl font-black text-cyan tracking-wide mt-1">
                            Smarter Decisions. Better Harvests.
                        </p>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm sm:text-base text-slate-200/90 font-medium max-w-lg leading-relaxed animate-fade-in">
                        AI-powered intelligence for modern farming. Real-time pathology scans, neural crop recommendations, Doppler rainfall analytics, and Mandi price benchmarks.
                    </p>

                    {/* Large Premium Enter Farm Button */}
                    <div className="pt-3 animate-fade-in">
                        <button
                            onClick={handleEnterFarm}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleEnterFarm();
                                }
                            }}
                            autoFocus
                            tabIndex={0}
                            aria-label="Enter Smart Farm Assistant application"
                            className="group relative inline-flex items-center space-x-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-navy-900/95 hover:bg-teal-800 text-white font-black text-sm sm:text-base uppercase tracking-wider border-2 border-cyan/70 hover:border-lime shadow-2xl shadow-cyan/30 hover:shadow-glow-cyan transform hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan/50"
                        >
                            <span className="relative z-10 tracking-widest text-white font-black">
                                Enter Farm
                            </span>
                            <ArrowRight className="w-5 h-5 text-cyan group-hover:text-lime group-hover:translate-x-1.5 transition-all duration-300" />
                            
                            {/* Glowing highlight effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan/20 via-transparent to-lime/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </button>
                    </div>

                    {/* Quick Helper Key Note */}
                    <p className="text-[11px] font-bold text-slate-400/80 tracking-wider uppercase">
                        Press <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] border border-white/20">ENTER ↵</span> to Launch OS
                    </p>
                </div>
            </div>
        </div>
    );
}

