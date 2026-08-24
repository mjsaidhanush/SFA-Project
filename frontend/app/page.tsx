"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Sprout } from 'lucide-react';

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
        <div className="min-h-screen w-screen h-screen relative overflow-hidden font-sans bg-[#0B1118] select-none">
            {/* Cinematic Landing Container with Slide Transition */}
            <div
                className={`fixed inset-0 z-50 w-full h-full flex items-center justify-center transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isSlidingOut 
                        ? "-translate-x-full opacity-90 scale-[0.98] pointer-events-none shadow-[30px_0_90px_rgba(24,213,208,0.6)]" 
                        : "translate-x-0 opacity-100 scale-100"
                }`}
            >
                {/* 1. High-Resolution Agricultural Background Image covering entire viewport */}
                <div
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform ${
                        isSlidingOut ? "scale-115 blur-xs" : "scale-105"
                    } ${bgLoaded ? "opacity-100" : "opacity-0"}`}
                    style={{ backgroundImage: "url('/farm-background.jpg')" }}
                ></div>

                {/* 7. Laser Light Sweep & Cyan Light Trail during enter transition */}
                {isSlidingOut && (
                    <div className="absolute inset-y-0 w-56 bg-gradient-to-r from-transparent via-cyan to-white filter blur-lg z-30 animate-light-sweep pointer-events-none"></div>
                )}

                {/* 12. Minimal Elegant Loading State */}
                {!bgLoaded && (
                    <div className="absolute inset-0 bg-[#0B1118] flex flex-col items-center justify-center z-0 text-white space-y-4">
                        <div className="w-12 h-12 rounded-2xl border-2 border-cyan border-t-transparent animate-spin"></div>
                        <div className="flex items-center space-x-2">
                            <Sprout className="w-5 h-5 text-cyan animate-pulse" />
                            <span className="text-xs font-black tracking-widest uppercase text-cyan">SMART FARM ASSISTANT</span>
                        </div>
                    </div>
                )}

                {/* 2. Dark Cinematic Gradient Overlay & Soft Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1118]/85 via-[#101820]/60 to-[#0B1118]/90 mix-blend-multiply backdrop-blur-[2px] z-10 transition-opacity duration-1000"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(11,17,24,0.92)_100%)] z-10"></div>

                {/* Ambient Glowing Orbs & Center Halo Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-radial from-cyan/25 via-teal-800/15 to-transparent rounded-full filter blur-[100px] pointer-events-none z-10"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/15 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime/10 rounded-full filter blur-[120px] pointer-events-none z-10 animate-blob animation-delay-2000"></div>

                {/* Floating Light Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
                    <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#18D5D0] animate-float-particle"></div>
                    <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_10px_#A8E63D] animate-float-particle" style={{ animationDelay: '1.2s' }}></div>
                    <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] animate-float-particle" style={{ animationDelay: '0.6s' }}></div>
                </div>

                {/* 3 & 4. Center Content with Staggered Brand Animation (1-1.5s sequence) */}
                <div className="relative z-20 max-w-2xl mx-auto px-6 text-center flex flex-col items-center space-y-6">
                    
                    {/* 3. Logo softly scales from 95% -> 100% */}
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

                    {/* 4. Main Heading fades upward */}
                    <div 
                        className="space-y-2 animate-entry-fade-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-cyan/15 rounded-full text-xs font-black text-cyan uppercase tracking-widest border border-cyan/30">
                            <span>🌱</span>
                            <span>SMART FARM ASSISTANT</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                            Smarter Decisions.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan to-lime">
                                Better Harvests.
                            </span>
                        </h1>
                    </div>

                    {/* 6. Description appears */}
                    <p 
                        className="text-xs sm:text-sm font-bold text-slate-300/90 max-w-md tracking-wide animate-entry-fade-up"
                        style={{ animationDelay: '700ms' }}
                    >
                        AI-powered intelligence for modern farming.
                    </p>

                    {/* 7. Enter Button appears last (1000ms delay) */}
                    <div 
                        className="pt-2 animate-entry-fade-up"
                        style={{ animationDelay: '1000ms' }}
                    >
                        <button
                            onClick={handleEnterFarm}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleEnterFarm();
                                }
                            }}
                            autoFocus
                            tabIndex={0}
                            aria-label="Enter Farm"
                            className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#101820] to-[#15222E] text-white font-black text-sm sm:text-base tracking-wider uppercase border-2 border-cyan/50 hover:border-lime shadow-[0_0_30px_rgba(24,213,208,0.4)] hover:shadow-[0_0_45px_rgba(168,230,61,0.6)] focus:ring-4 focus:ring-cyan/40 outline-none transition-all duration-300 active:scale-95 cursor-pointer"
                        >
                            <span className="relative z-10 flex items-center space-x-3 text-white group-hover:text-cyan transition-colors">
                                <span>Enter Farm</span>
                                <ArrowRight className="w-5 h-5 text-cyan group-hover:translate-x-1.5 group-hover:text-lime transition-transform duration-300" />
                            </span>
                        </button>
                    </div>

                    {/* Micro Navigation Cue */}
                    <p 
                        className="text-[10px] font-mono text-cyan/70 tracking-widest uppercase animate-entry-fade-up"
                        style={{ animationDelay: '1200ms' }}
                    >
                        Press <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">ENTER ↵</span> or Click to Enter
                    </p>
                </div>
            </div>
        </div>
    );
}


